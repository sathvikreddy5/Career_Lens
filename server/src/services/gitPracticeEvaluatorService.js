const normalizeCommand = (command = "") =>
  command.trim().replace(/\s+/g, " ").replace(/;$/, "").toLowerCase();

export const evaluateGitTask = ({ code, task }) => {
  if (!code || !code.trim()) {
    return {
      success: false,
      message: "Please enter a Git command.",
      passedTests: 0,
      totalTests: 1,
      results: [],
    };
  }

  const submitted = normalizeCommand(code);

  const acceptedCommands = (task.acceptedCommands || []).map(normalizeCommand);

  const passed = acceptedCommands.includes(submitted);

  return {
    success: passed,
    message: passed
      ? "Correct Git command!"
      : "That command is not the expected solution.",
    passedTests: passed ? 1 : 0,
    totalTests: 1,
    results: [
      {
        expected: task.expectedCommand,
        actual: code.trim(),
        passed,
      },
    ],
  };
};
