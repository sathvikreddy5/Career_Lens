const clone = (value) => JSON.parse(JSON.stringify(value));

const getValue = (document, field) => {
  return field.split(".").reduce((current, key) => current?.[key], document);
};

const matchesCondition = (value, condition) => {
  if (condition && typeof condition === "object" && !Array.isArray(condition)) {
    for (const [operator, expected] of Object.entries(condition)) {
      switch (operator) {
        case "$gt":
          if (!(value > expected)) return false;
          break;

        case "$gte":
          if (!(value >= expected)) return false;
          break;

        case "$lt":
          if (!(value < expected)) return false;
          break;

        case "$lte":
          if (!(value <= expected)) return false;
          break;

        case "$eq":
          if (value !== expected) return false;
          break;

        case "$ne":
          if (value === expected) return false;
          break;

        case "$in":
          if (!expected.includes(value)) return false;
          break;

        case "$nin":
          if (expected.includes(value)) return false;
          break;

        default:
          return false;
      }
    }

    return true;
  }

  return value === condition;
};

const matchesDocument = (document, filter = {}) => {
  for (const [field, condition] of Object.entries(filter)) {
    const value = getValue(document, field);

    if (!matchesCondition(value, condition)) {
      return false;
    }
  }

  return true;
};

const applyProjection = (document, projection) => {
  if (!projection || Object.keys(projection).length === 0) {
    return clone(document);
  }

  const includeFields = Object.entries(projection)
    .filter(([, value]) => value === 1)
    .map(([field]) => field);

  const excludeFields = Object.entries(projection)
    .filter(([, value]) => value === 0)
    .map(([field]) => field);

  if (includeFields.length > 0) {
    const result = {};

    for (const field of includeFields) {
      result[field] = getValue(document, field);
    }

    if (projection._id !== 0 && document._id !== undefined) {
      result._id = document._id;
    }

    return result;
  }

  const result = clone(document);

  for (const field of excludeFields) {
    delete result[field];
  }

  return result;
};

const applySort = (documents, sort) => {
  if (!sort || Object.keys(sort).length === 0) {
    return documents;
  }

  const entries = Object.entries(sort);

  return [...documents].sort((a, b) => {
    for (const [field, direction] of entries) {
      const aValue = getValue(a, field);
      const bValue = getValue(b, field);

      if (aValue === bValue) continue;

      if (aValue === undefined) return -1;
      if (bValue === undefined) return 1;

      const comparison = aValue > bValue ? 1 : -1;

      return direction === -1 ? -comparison : comparison;
    }

    return 0;
  });
};

const parseMongoQuery = (code) => {
  const cleaned = code.trim().replace(/;+\s*$/, "");

  const match = cleaned.match(
    /^db\.([a-zA-Z_][\w]*)\.find\(\s*(.*?)\s*\)(?:\.sort\(\s*(.*?)\s*\))?(?:\.limit\(\s*(\d+)\s*\))?$/,
  );

  if (!match) {
    throw new Error(
      "Supported format: db.collection.find({...}).sort({...}).limit(n)",
    );
  }

  const collectionName = match[1];

  const filterText = match[2];

  const sortText = match[3];

  const limitText = match[4];

  let filter = {};

  if (filterText) {
    filter = Function(`"use strict"; return (${filterText});`)();
  }

  let sort = null;

  if (sortText) {
    sort = Function(`"use strict"; return (${sortText});`)();
  }

  return {
    collectionName,
    filter,
    sort,
    limit: limitText ? Number(limitText) : null,
  };
};

export const evaluateMongoTask = async ({ code, task }) => {
  if (!code || !code.trim()) {
    return {
      success: false,
      message: "Please write your MongoDB query first.",
      passedTests: 0,
      totalTests: task.testCases?.length || 0,
      results: [],
    };
  }

  if (!task.testCases?.length) {
    return {
      success: false,
      message: "This MongoDB task does not have test cases yet.",
      passedTests: 0,
      totalTests: 0,
      results: [],
    };
  }

  try {
    const query = parseMongoQuery(code);

    const collection = task.dataset?.[query.collectionName];

    if (!collection) {
      return {
        success: false,
        message: `Collection "${query.collectionName}" does not exist.`,
        passedTests: 0,
        totalTests: task.testCases.length,
        results: [],
      };
    }

    let documents = collection.filter((document) =>
      matchesDocument(document, query.filter),
    );

    documents = applySort(documents, query.sort);

    if (query.limit !== null) {
      documents = documents.slice(0, query.limit);
    }

    const results = task.testCases.map((testCase) => {
      const actual = documents.map((document) =>
        applyProjection(document, testCase.projection),
      );

      const expected = testCase.expectedRows;

      const passed = JSON.stringify(actual) === JSON.stringify(expected);

      return {
        expected,
        actual,
        passed,
      };
    });

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
      message: "Your MongoDB query could not be evaluated.",
      error: error.message,
      passedTests: 0,
      totalTests: task.testCases.length,
      results: [],
    };
  }
};
