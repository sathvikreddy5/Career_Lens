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

const escapeJavaString = (value) => {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
};

const createJavaArgument = (value) => {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return `"${escapeJavaString(value)}"`;
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  throw new Error(`Unsupported Java test input: ${JSON.stringify(value)}`);
};

const createExpectedOutput = (value) => {
  if (typeof value === "string") {
    return value;
  }

  return String(value);
};

export const evaluateJavaTask = async ({ code, task }) => {
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

  const functionMatch = code.match(
    /(?:public\s+|private\s+|protected\s+)?(?:static\s+)?[\w<>\[\]]+\s+([a-zA-Z_$][\w$]*)\s*\(/,
  );

  if (!functionMatch) {
    return {
      success: false,
      message: "Could not find a Java method in your code.",
      passedTests: 0,
      totalTests: task.testCases.length,
      results: [],
    };
  }

  const methodName = functionMatch[1];

  const tempDirectory = path.join(
    os.tmpdir(),
    `careershield-java-${crypto.randomUUID()}`,
  );

  try {
    await fs.mkdir(tempDirectory, {
      recursive: true,
    });

    const solutionPath = path.join(tempDirectory, "Solution.java");

    const runnerPath = path.join(tempDirectory, "Runner.java");

    await fs.writeFile(solutionPath, code, "utf8");

    const testCalls = task.testCases
      .map((testCase) => {
        const args = testCase.input.map(createJavaArgument).join(", ");

        return `
        try {
            Object result = Solution.${methodName}(${args});
            System.out.println("RESULT:" + String.valueOf(result));
        } catch (Exception e) {
            System.out.println("ERROR:" + e.getMessage());
        }
        `;
      })
      .join("\n");

    const runnerCode = `
public class Runner {

    public static void main(String[] args) {

        ${testCalls}

    }
}
`;

    await fs.writeFile(runnerPath, runnerCode, "utf8");

    // Compile Solution.java
    const compileSolution = await runCommand("javac", ["Solution.java"], {
      cwd: tempDirectory,
      timeout: 5000,
    });

    if (compileSolution.code !== 0) {
      return {
        success: false,
        message: "Your Java code has compilation errors.",
        error: compileSolution.stderr,
        passedTests: 0,
        totalTests: task.testCases.length,
        results: [],
      };
    }

    // Compile Runner.java
    const compileRunner = await runCommand("javac", ["Runner.java"], {
      cwd: tempDirectory,
      timeout: 5000,
    });

    if (compileRunner.code !== 0) {
      return {
        success: false,
        message: "The practice runner could not be compiled.",
        error: compileRunner.stderr,
        passedTests: 0,
        totalTests: task.testCases.length,
        results: [],
      };
    }

    // Run Java program
    const execution = await runCommand("java", ["Runner"], {
      cwd: tempDirectory,
      timeout: 5000,
    });

    if (execution.code !== 0) {
      return {
        success: false,
        message: "Your Java program could not be executed.",
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

      const actual = isError
        ? null
        : output.startsWith("RESULT:")
          ? output.substring("RESULT:".length).trim()
          : "";

      const expected = createExpectedOutput(testCase.expected);

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
      message: "Unable to evaluate your Java code.",
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
