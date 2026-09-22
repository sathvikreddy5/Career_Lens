import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";
import { spawn } from "child_process";

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      child.kill();
      resolve({
        code: -1,
        stdout,
        stderr: "Execution timed out.",
      });
    }, options.timeout || 5000);

    child.on("close", (code) => {
      clearTimeout(timer);

      resolve({
        code,
        stdout,
        stderr,
      });
    });

    child.on("error", (error) => {
      clearTimeout(timer);

      resolve({
        code: -1,
        stdout,
        stderr: error.message,
      });
    });
  });
};

const createPythonArgument = (value) => {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  throw new Error(`Unsupported Python test input: ${JSON.stringify(value)}`);
};

export const evaluatePythonTask = async ({ code, task }) => {
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

  const functionMatch = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);

  if (!functionMatch) {
    return {
      success: false,
      message: "Could not find a Python function in your code.",
      passedTests: 0,
      totalTests: task.testCases.length,
      results: [],
    };
  }

  const functionName = functionMatch[1];

  const tempDirectory = path.join(
    os.tmpdir(),
    `careershield-python-${crypto.randomUUID()}`,
  );

  try {
    await fs.mkdir(tempDirectory, {
      recursive: true,
    });

    const solutionPath = path.join(tempDirectory, "solution.py");

    const runnerPath = path.join(tempDirectory, "runner.py");

    await fs.writeFile(solutionPath, code, "utf8");

    const testCalls = task.testCases
      .map((testCase) => {
        const args = testCase.input.map(createPythonArgument).join(", ");

        return `
try:
    result = ${functionName}(${args})
    print("RESULT:" + str(result))
except Exception as e:
    print("ERROR:" + str(e))
`;
      })
      .join("\n");

    const runnerCode = `
from solution import ${functionName}

${testCalls}
`;

    await fs.writeFile(runnerPath, runnerCode, "utf8");

    // Check Python installation
    const pythonCommand = process.platform === "win32" ? "python" : "python3";

    const execution = await runCommand(pythonCommand, ["runner.py"], {
      cwd: tempDirectory,
      timeout: 5000,
    });

    if (execution.code === -1) {
      return {
        success: false,
        message:
          "Python could not be started. Make sure Python is installed and available in PATH.",
        error: execution.stderr,
        passedTests: 0,
        totalTests: task.testCases.length,
        results: [],
      };
    }

    if (execution.code !== 0) {
      return {
        success: false,
        message: "Your Python code has an execution error.",
        error: execution.stderr,
        passedTests: 0,
        totalTests: task.testCases.length,
        results: [],
      };
    }

    const outputLines = execution.stdout
      .split(/\r?\n/)
      .filter(
        (line) => line.startsWith("RESULT:") || line.startsWith("ERROR:"),
      );

    const results = task.testCases.map((testCase, index) => {
      const output = outputLines[index] || "";

      const isError = output.startsWith("ERROR:");

      const actual = isError ? null : output.substring("RESULT:".length).trim();

      const expected =
        typeof testCase.expected === "string"
          ? testCase.expected
          : String(testCase.expected);

      const passed = !isError && actual === expected;

      return {
        input: testCase.input,
        expected: testCase.expected,
        actual,
        passed,
        error: isError ? output.substring("ERROR:".length).trim() : undefined,
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
      message: "Unable to evaluate your Python code.",
      error: error.message,
      passedTests: 0,
      totalTests: task.testCases.length,
      results: [],
    };
  } finally {
    await fs
      .rm(tempDirectory, {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  }
};
