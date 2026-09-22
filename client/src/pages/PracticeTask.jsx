import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Code2,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
  XCircle,
} from "lucide-react";

import api from "../services/api";

const PracticeTask = () => {
  const navigate = useNavigate();
  const { skillId, taskIndex } = useParams();

  const [practiceData, setPracticeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const [showHint, setShowHint] = useState(false);
  const [code, setCode] = useState("");

  // Evaluator state
  const [running, setRunning] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const decodedSkillId = decodeURIComponent(skillId || "");
  const currentIndex = Number(taskIndex);

  // --------------------------------------------------
  // Load practice data
  // --------------------------------------------------

  useEffect(() => {
    const loadPractice = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/practice");

        setPracticeData(response.data);
      } catch (err) {
        console.error("Failed to load practice task:", err);

        setError(
          err.response?.data?.message || "Unable to load this practice task.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPractice();
  }, []);

  // --------------------------------------------------
  // Load saved progress
  // --------------------------------------------------

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await api.get("/practice/progress");

        const progressList = response.data?.progress || [];

        const currentProgress = progressList.find(
          (item) =>
            item.skillId === decodedSkillId && item.taskIndex === currentIndex,
        );

        setCompleted(currentProgress?.completed === true);
      } catch (err) {
        console.error("Failed to load practice progress:", err);
      }
    };

    if (practiceData && decodedSkillId && !Number.isNaN(currentIndex)) {
      loadProgress();
    }
  }, [practiceData, decodedSkillId, currentIndex]);

  // --------------------------------------------------
  // Find selected skill
  // --------------------------------------------------

  const selectedSkill = useMemo(() => {
    const skills = practiceData?.practice || [];

    return skills.find(
      (item) =>
        item.skillId === decodedSkillId ||
        item.skillName?.toLowerCase() === decodedSkillId.toLowerCase(),
    );
  }, [practiceData, decodedSkillId]);

  const task = selectedSkill?.practice?.[currentIndex];

  const totalTasks = selectedSkill?.practice?.length || 0;

  const isFirstTask = currentIndex === 0;

  const isLastTask = currentIndex === totalTasks - 1;

  // --------------------------------------------------
  // Run & Check
  // --------------------------------------------------

  const runCode = async () => {
    if (!code.trim()) {
      setEvaluation({
        success: false,
        message: "Please write your solution first.",
        passedTests: 0,
        totalTests: task?.testCases?.length || 0,
        results: [],
      });

      return;
    }

    try {
      setRunning(true);
      setEvaluation(null);

      const response = await api.post("/practice/run", {
        skillId: selectedSkill.skillId,
        taskId: task.id,
        code,
      });

      setEvaluation(response.data);
    } catch (err) {
      console.error("Failed to run practice task:", err);

      setEvaluation({
        success: false,
        message: err.response?.data?.message || "Unable to evaluate your code.",
        passedTests: 0,
        totalTests: task?.testCases?.length || 0,
        results: [],
      });
    } finally {
      setRunning(false);
    }
  };

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const nextTask = () => {
    if (!selectedSkill || isLastTask) return;

    navigate(
      `/practice/${encodeURIComponent(
        selectedSkill.skillId,
      )}/${currentIndex + 1}`,
    );

    setCompleted(false);
    setShowHint(false);
    setCode("");
    setEvaluation(null);
  };

  const previousTask = () => {
    if (!selectedSkill || isFirstTask) return;

    navigate(
      `/practice/${encodeURIComponent(
        selectedSkill.skillId,
      )}/${currentIndex - 1}`,
    );

    setCompleted(false);
    setShowHint(false);
    setCode("");
    setEvaluation(null);
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const resetWorkspace = () => {
    if (task?.language === "git") {
      setCode("");
    } else {
      setCode(task?.starterCode || "");
    }

    setEvaluation(null);
    setShowHint(false);
  };

  // --------------------------------------------------
  // Mark completed
  // --------------------------------------------------

  const markCompleted = async () => {
    // Do not allow completion without passing tests
    if (!evaluation?.success) {
      return;
    }

    try {
      setSavingProgress(true);

      await api.post("/practice/progress", {
        skillId: selectedSkill.skillId,
        taskIndex: currentIndex,
        completed: true,
      });

      setCompleted(true);
    } catch (err) {
      console.error("Failed to save practice progress:", err);
    } finally {
      setSavingProgress(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F6F7F9]">
        <div className="flex items-center gap-2 text-sm text-[#667085]">
          <Loader2 size={18} className="animate-spin" />
          Loading practice task...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error / unavailable task
  // --------------------------------------------------

  if (error || !selectedSkill || !task) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F6F7F9] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate("/practice")}
            className="mb-6 flex items-center gap-2 text-[12px] font-medium text-[#667085] transition hover:text-[#20252D]"
          >
            <ArrowLeft size={15} />
            Back to Practice
          </button>

          <div className="rounded-xl border border-[#E1E5EA] bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#DC2626]">
              <Code2 size={22} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#20252D]">
              Practice task unavailable
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-[#667085]">
              {error || "The requested practice task could not be found."}
            </p>

            <button
              onClick={() => navigate("/practice")}
              className="mt-5 rounded-lg bg-[#111111] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#2A2A2A]"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  const editorLanguage =
    task.language === "git" ? "shell" : task.language || "javascript";

  const editorValue =
    task.language === "git"
      ? code
      : code || task.starterCode || getPlaceholder(selectedSkill.skillId);

  const workspaceDescription =
    task.language === "git"
      ? "Enter the Git command that solves this task."
      : task.language === "sql"
        ? "Write your SQL query and run it against the practice database."
        : task.language === "mongodb"
          ? "Write your MongoDB query and run it against the practice dataset."
          : "Write your solution and run it against the test cases.";

  const runDescription =
    task.language === "git"
      ? "Enter the command, then run it to check your answer."
      : "Run your code to check it against the practice test cases.";

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F6F7F9] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <button
          onClick={() => navigate("/practice")}
          className="mb-5 flex items-center gap-2 text-[12px] font-medium text-[#667085] transition hover:text-[#20252D]"
        >
          <ArrowLeft size={15} />
          Back to Practice
        </button>

        {/* Header */}
        <section className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[9px] font-medium text-[#6072D8]">
                  {selectedSkill.skillName}
                </span>

                <span className="text-[10px] text-[#9CA3AF]">
                  Task {currentIndex + 1} of {totalTasks}
                </span>

                {task.difficulty && (
                  <DifficultyBadge difficulty={task.difficulty} />
                )}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-[#20252D] sm:text-3xl">
                {task.title}
              </h1>

              <p className="mt-2 max-w-3xl text-[13px] leading-6 text-[#667085]">
                {task.description}
              </p>
            </div>

            <div className="shrink-0 rounded-lg border border-[#E1E5EA] bg-white px-4 py-3">
              <p className="text-[9px] uppercase tracking-wide text-[#9CA3AF]">
                Skill
              </p>

              <p className="mt-1 text-[12px] font-semibold text-[#20252D]">
                {selectedSkill.skillName}
              </p>
            </div>
          </div>
        </section>

        {/* Main grid */}
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div className="space-y-5">
            {/* What to practice */}
            <section className="rounded-xl border border-[#E1E5EA] bg-white">
              <div className="border-b border-[#E1E5EA] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-[#6072D8]" />

                  <h2 className="text-[14px] font-semibold text-[#20252D]">
                    What you should practice
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[12px] leading-6 text-[#667085]">
                  Focus on understanding the concept, not just finishing the
                  task. Work through the exercise yourself first and try to
                  explain your approach before checking the hint.
                </p>
              </div>
            </section>

            {/* Task */}
            <section className="rounded-xl border border-[#E1E5EA] bg-white">
              <div className="border-b border-[#E1E5EA] px-5 py-4 sm:px-6">
                <h2 className="text-[14px] font-semibold text-[#20252D]">
                  Your task
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-lg border border-[#E1E5EA] bg-[#FAFBFC] p-4">
                  <p className="text-[12px] leading-6 text-[#667085]">
                    {task.description}
                  </p>

                  {task.instructions?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {task.instructions.map((instruction, index) => (
                        <div
                          key={`${instruction}-${index}`}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-[8px] font-semibold text-[#6072D8]">
                            {index + 1}
                          </span>

                          <p className="text-[11px] leading-5 text-[#667085]">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Practice Workspace */}
            <section className="overflow-hidden rounded-xl border border-[#E1E5EA] bg-white">
              <div className="flex flex-col gap-3 border-b border-[#E1E5EA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-[#6072D8]" />

                    <h2 className="text-[14px] font-semibold text-[#20252D]">
                      Practice workspace
                    </h2>
                  </div>

                  <p className="mt-1 text-[10px] text-[#9CA3AF]">
                    {workspaceDescription}
                  </p>
                </div>

                <button
                  onClick={resetWorkspace}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E1E5EA] px-3 py-2 text-[10px] font-medium text-[#667085] transition hover:bg-[#F8F9FB]"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              <div className="p-5 sm:p-6">
                {/* Code editor */}
                <div className="overflow-hidden rounded-xl border border-[#252A34] bg-[#20252D]">
                  <div className="flex items-center gap-2 border-b border-[#3A404B] px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />

                    <span className="ml-2 text-[10px] text-[#9CA3AF]">
                      {task.language || "code"} · practice-workspace
                    </span>
                  </div>

                  <Editor
                    height="320px"
                    language={editorLanguage}
                    theme="vs-dark"
                    value={editorValue}
                    onChange={(value) => {
                      setCode(value || "");
                      setEvaluation(null);
                    }}
                    options={{
                      minimap: {
                        enabled: false,
                      },

                      fontSize: 13,

                      fontFamily:
                        "'JetBrains Mono', 'Fira Code', Consolas, monospace",

                      lineNumbers: "on",

                      roundedSelection: false,

                      scrollBeyondLastLine: false,

                      automaticLayout: true,

                      tabSize: 2,

                      insertSpaces: true,

                      wordWrap: "on",

                      bracketPairColorization: {
                        enabled: true,
                      },

                      guides: {
                        bracketPairs: true,
                        indentation: true,
                      },

                      autoClosingBrackets: "always",

                      autoClosingQuotes: "always",

                      suggestOnTriggerCharacters: true,

                      quickSuggestions: true,

                      folding: true,

                      formatOnPaste: true,

                      formatOnType: true,

                      padding: {
                        top: 16,
                        bottom: 16,
                      },
                    }}
                  />
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-5 text-[#9CA3AF]">
                    {runDescription}
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={runCode}
                      disabled={running}
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#20252D] px-4 py-2.5 text-[11px] font-medium text-white transition hover:bg-[#343A46] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {running ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Play size={14} />
                      )}

                      {running ? "Checking..." : "Run & Check"}
                    </button>

                    <button
                      onClick={markCompleted}
                      disabled={
                        completed || savingProgress || !evaluation?.success
                      }
                      title={
                        !evaluation?.success && !completed
                          ? "Pass all test cases first"
                          : ""
                      }
                      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[11px] font-medium transition ${
                        completed
                          ? "bg-[#ECFDF3] text-[#15803D]"
                          : evaluation?.success
                            ? "bg-[#6072D8] text-white hover:bg-[#5264CC]"
                            : "cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]"
                      }`}
                    >
                      <CheckCircle2 size={14} />

                      {completed
                        ? "Task completed"
                        : savingProgress
                          ? "Saving..."
                          : "Mark completed"}
                    </button>
                  </div>
                </div>

                {/* Evaluation result */}
                {evaluation && <EvaluationResult evaluation={evaluation} />}
              </div>
            </section>

            {/* Suggested approach */}
            <section className="rounded-xl border border-[#E1E5EA] bg-white">
              <div className="border-b border-[#E1E5EA] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <ChevronRight size={15} className="text-[#6072D8]" />

                  <h2 className="text-[14px] font-semibold text-[#20252D]">
                    Suggested approach
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {[
                    "Understand what the task is asking.",
                    `Identify the concepts related to ${selectedSkill.skillName}.`,
                    "Implement your solution and test it with examples.",
                    "Review your approach and think about improvements.",
                  ].map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-[9px] font-semibold text-[#6072D8]">
                        {index + 1}
                      </div>

                      <p className="pt-0.5 text-[11px] leading-5 text-[#667085]">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Hint */}
            <section className="rounded-xl border border-[#E1E5EA] bg-white">
              <div className="p-5 sm:p-6">
                <button
                  onClick={() => setShowHint((value) => !value)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-[#C58A00]" />

                    <span className="text-[13px] font-semibold text-[#20252D]">
                      Hint
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-[#667085]">
                    {showHint ? "Hide hint" : "Show hint"}
                  </span>
                </button>

                {showHint && (
                  <div className="mt-4 rounded-lg border border-[#F1E8C8] bg-[#FFFCF2] p-4">
                    <p className="text-[11px] leading-5 text-[#667085]">
                      {task.hint ||
                        `Start with the fundamentals of ${selectedSkill.skillName}. Break the task into smaller steps and verify each step before moving forward.`}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Navigation */}
            <div className="flex flex-col gap-3 border-t border-[#E1E5EA] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={previousTask}
                disabled={isFirstTask}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#E1E5EA] px-4 py-2.5 text-[11px] font-medium text-[#667085] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <button
                onClick={() => navigate("/practice")}
                className="text-[11px] font-medium text-[#667085] hover:text-[#20252D]"
              >
                Back to practice
              </button>

              <button
                onClick={nextTask}
                disabled={isLastTask}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#6072D8] px-4 py-2.5 text-[11px] font-medium text-white transition hover:bg-[#5264CC] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next task
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-[#E1E5EA] bg-white lg:sticky lg:top-6">
            <div className="border-b border-[#E1E5EA] px-5 py-4">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                Progress
              </p>

              <div className="mt-1 flex items-end justify-between">
                <h2 className="text-[15px] font-semibold text-[#20252D]">
                  {currentIndex + 1} / {totalTasks}
                </h2>

                <span className="text-[10px] text-[#9CA3AF]">
                  {selectedSkill.skillName}
                </span>
              </div>
            </div>

            <div className="p-3">
              {selectedSkill.practice.map((item, index) => {
                const active = index === currentIndex;

                return (
                  <button
                    key={`${selectedSkill.skillId}-${index}`}
                    onClick={() =>
                      navigate(
                        `/practice/${encodeURIComponent(
                          selectedSkill.skillId,
                        )}/${index}`,
                      )
                    }
                    className={`mb-1 flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                      active
                        ? "bg-[#EEF1FF] text-[#20252D]"
                        : "text-[#667085] hover:bg-[#F8F9FB]"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-semibold ${
                        active
                          ? "bg-white text-[#6072D8]"
                          : "bg-[#F3F4F6] text-[#667085]"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#9CA3AF]">
                        {item.difficulty || "Practice"}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight
                        size={13}
                        className="shrink-0 text-[#6072D8]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// Evaluation Result
// --------------------------------------------------

const EvaluationResult = ({ evaluation }) => {
  const {
    success,
    message,
    passedTests = 0,
    totalTests = 0,
    results = [],
    error,
  } = evaluation;

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[#E1E5EA]">
      {/* Result header */}
      <div
        className={`border-b px-5 py-4 ${
          success
            ? "border-[#BBF7D0] bg-[#F0FDF4]"
            : "border-[#FECACA] bg-[#FEF2F2]"
        }`}
      >
        <div className="flex items-start gap-3">
          {success ? (
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-[#16A34A]"
            />
          ) : (
            <CircleAlert size={19} className="mt-0.5 shrink-0 text-[#DC2626]" />
          )}

          <div className="min-w-0">
            <p
              className={`text-[13px] font-semibold ${
                success ? "text-[#15803D]" : "text-[#B91C1C]"
              }`}
            >
              {success ? "All test cases passed!" : "Some test cases failed"}
            </p>

            <p className="mt-1 text-[10px] text-[#667085]">{message}</p>
          </div>
        </div>

        {/* Test count */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">
            Test results
          </span>

          <span
            className={`text-[12px] font-semibold ${
              success ? "text-[#15803D]" : "text-[#B91C1C]"
            }`}
          >
            {passedTests} / {totalTests} passed
          </span>
        </div>

        {/* Progress bar */}
        {totalTests > 0 && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className={`h-full rounded-full transition-all ${
                success ? "bg-[#22C55E]" : "bg-[#EF4444]"
              }`}
              style={{
                width: `${Math.min(100, (passedTests / totalTests) * 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Evaluation error */}
      {error && (
        <div className="border-b border-[#E1E5EA] bg-white px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">
            Error
          </p>

          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[#FEF2F2] p-3 font-mono text-[10px] leading-5 text-[#B91C1C]">
            {error}
          </pre>
        </div>
      )}

      {/* Individual test cases */}
      {results.length > 0 && (
        <div className="divide-y divide-[#E1E5EA] bg-white">
          {results.map((result, index) => (
            <div key={`test-${index}`} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckCircle2 size={15} className="text-[#16A34A]" />
                  ) : (
                    <XCircle size={15} className="text-[#DC2626]" />
                  )}

                  <span className="text-[11px] font-semibold text-[#20252D]">
                    Test case {index + 1}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-medium ${
                    result.passed ? "text-[#15803D]" : "text-[#B91C1C]"
                  }`}
                >
                  {result.passed ? "Passed" : "Failed"}
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <TestValue label="Input" value={result.input} />

                <TestValue label="Expected" value={result.expected} />

                <TestValue
                  label="Your output"
                  value={result.error ? result.error : result.actual}
                  error={Boolean(result.error)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="border-t border-[#BBF7D0] bg-[#F0FDF4] px-5 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#16A34A]" />

            <p className="text-[10px] font-medium text-[#15803D]">
              You can now mark this task as completed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// Test Value
// --------------------------------------------------

const TestValue = ({ label, value, error = false }) => {
  return (
    <div>
      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>

      <div
        className={`min-h-[38px] rounded-lg border p-2.5 font-mono text-[10px] leading-5 ${
          error
            ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
            : "border-[#E1E5EA] bg-[#FAFBFC] text-[#667085]"
        }`}
      >
        {formatValue(value)}
      </div>
    </div>
  );
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatValue = (value) => {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const getPlaceholder = (skillId = "") => {
  const skill = skillId.toLowerCase();

  if (skill.includes("sql")) {
    return `-- Write your SQL query here

SELECT *
FROM your_table
WHERE ...;`;
  }

  if (skill.includes("git")) {
    return "";
  }

  if (skill.includes("java")) {
    return `// Write your Java solution here

public class Solution {
    public static void main(String[] args) {

    }
}`;
  }

  if (skill.includes("javascript")) {
    return `// Write your JavaScript solution here

function solution() {

}`;
  }

  if (skill.includes("python")) {
    return `# Write your Python solution here

def solution():
    pass`;
  }

  if (skill.includes("react")) {
    return `// Describe or write your React implementation here

function Component() {
  return (
    <div>

    </div>
  );
}`;
  }

  return `// Write your solution here

`;
};

const DifficultyBadge = ({ difficulty }) => {
  const value = difficulty || "Beginner";

  const styles = {
    Beginner: "bg-[#ECFDF3] text-[#15803D]",
    Easy: "bg-[#ECFDF3] text-[#15803D]",
    Intermediate: "bg-[#FFF7ED] text-[#C2410C]",
    Medium: "bg-[#FFF7ED] text-[#C2410C]",
    Advanced: "bg-[#FEF2F2] text-[#DC2626]",
    Hard: "bg-[#FEF2F2] text-[#DC2626]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
        styles[value] || "bg-[#F3F4F6] text-[#667085]"
      }`}
    >
      {value}
    </span>
  );
};

export default PracticeTask;
