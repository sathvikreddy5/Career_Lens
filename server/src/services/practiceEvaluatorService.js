const normalizeValue = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return Number(value);
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

export const evaluateJavaScriptTask = ({ code, task }) => {
  if (!code || !code.trim()) {
    return {
      success: false,
      message: "Please write your solution first.",
      passedTests: 0,
      totalTests: task.testCases?.length || 0,
      results: [],
    };
  }

  if (!task.testCases?.length) {
    return {
      success: false,
      message: "This task does not have test cases yet.",
      passedTests: 0,
      totalTests: 0,
      results: [],
    };
  }

  const results = [];

  let solutionFunction;

  try {
    const functionNameMatch = code.match(/function\s+([a-zA-Z_$][\w$]*)\s*\(/);

    if (!functionNameMatch) {
      return {
        success: false,
        message: "Could not find a function declaration in your code.",
        passedTests: 0,
        totalTests: task.testCases.length,
        results: [],
      };
    }

    const functionName = functionNameMatch[1];

    const createFunction = new Function(`
      ${code}

      return typeof ${functionName} === "function"
        ? ${functionName}
        : null;
    `);

    solutionFunction = createFunction();

    if (typeof solutionFunction !== "function") {
      throw new Error(`Function "${functionName}" could not be created.`);
    }
  } catch (error) {
    return {
      success: false,
      message: "Your code could not be evaluated.",
      error: error.message,
      passedTests: 0,
      totalTests: task.testCases.length,
      results: [],
    };
  }

  for (const testCase of task.testCases) {
    try {
      const actual = solutionFunction(...testCase.input);

      const normalizedActual = normalizeValue(actual);

      const normalizedExpected = normalizeValue(testCase.expected);

      const passed =
        JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected);

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual,
        passed,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
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
};
