import { Client } from "pg";

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value).trim();
};

const normalizeRows = (rows) => {
  return rows.map((row) => {
    const normalized = {};

    for (const [key, value] of Object.entries(row)) {
      normalized[key] = normalizeValue(value);
    }

    return normalized;
  });
};

const rowsAreEqual = (actual, expected) => {
  const actualRows = normalizeRows(actual);
  const expectedRows = normalizeRows(expected);

  if (actualRows.length !== expectedRows.length) {
    return false;
  }

  return JSON.stringify(actualRows) === JSON.stringify(expectedRows);
};

const isReadOnlyQuery = (query) => {
  const cleaned = query
    .trim()
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/--.*$/gm, "")
    .trim()
    .toLowerCase();

  return (
    cleaned.startsWith("select ") ||
    cleaned.startsWith("select\n") ||
    cleaned.startsWith("with ")
  );
};

export const evaluateSqlTask = async ({ code, task }) => {
  if (!code || !code.trim()) {
    return {
      success: false,
      message: "Please write your SQL query first.",
      passedTests: 0,
      totalTests: task.testCases?.length || 0,
      results: [],
    };
  }

  if (!isReadOnlyQuery(code)) {
    return {
      success: false,
      message: "Only SELECT queries are allowed in SQL practice.",
      passedTests: 0,
      totalTests: task.testCases?.length || 0,
      results: [],
    };
  }

  if (!task.testCases?.length) {
    return {
      success: false,
      message: "This SQL task does not have test cases yet.",
      passedTests: 0,
      totalTests: 0,
      results: [],
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    /*
     * Each task creates its own temporary tables.
     * Temporary tables disappear when this connection closes.
     */

    if (task.setupSql) {
      await client.query(task.setupSql);
    }

    const results = [];

    for (const testCase of task.testCases) {
      try {
        const result = await client.query(code);

        const passed = rowsAreEqual(result.rows, testCase.expectedRows);

        results.push({
          expected: testCase.expectedRows,
          actual: result.rows,
          passed,
        });
      } catch (error) {
        results.push({
          expected: testCase.expectedRows,
          actual: null,
          passed: false,
          error: error.message,
        });
      }
    }

    const passedTests = results.filter((result) => result.passed).length;

    const success = passedTests === task.testCases.length;

    return {
      success,
      message: success
        ? "All test cases passed!"
        : `${passedTests} of ${task.testCases.length} test cases passed.`,
      passedTests,
      totalTests: task.testCases.length,
      results,
    };
  } catch (error) {
    return {
      success: false,
      message: "Unable to connect to the SQL practice database.",
      error: error.message,
      passedTests: 0,
      totalTests: task.testCases.length,
      results: [],
    };
  } finally {
    await client.end().catch(() => {});
  }
};
