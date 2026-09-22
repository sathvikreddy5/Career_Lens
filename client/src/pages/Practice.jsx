import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  ExternalLink,
  FolderKanban,
  Loader2,
  Target,
} from "lucide-react";

import api from "../services/api";

const Practice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [practiceData, setPracticeData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPractice = async () => {
      try {
        setLoading(true);
        setError("");

        const [practiceResponse, progressResponse] = await Promise.all([
          api.get("/practice"),
          api.get("/practice/progress"),
        ]);
        console.log("PRACTICE RESPONSE:", practiceResponse.data);

        const practice = practiceResponse.data;
        const progressList = progressResponse.data?.progress || [];

        setPracticeData(practice);
        setProgress(progressList);

        const firstSkill = practice?.practice?.[0];

        const requestedSkill = searchParams.get("skill");

        const matchingSkill = practice?.practice?.find(
          (skill) =>
            skill.skillId === requestedSkill ||
            skill.skillName?.toLowerCase() === requestedSkill?.toLowerCase(),
        );

        if (matchingSkill) {
          setSelectedSkillId(matchingSkill.skillId);
        } else if (firstSkill) {
          setSelectedSkillId(firstSkill.skillId);
        }
      } catch (err) {
        console.error("Failed to load practice:", err);

        setError(
          err.response?.data?.message || "Unable to load practice resources.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPractice();
  }, [searchParams]);

  const skills = practiceData?.practice || [];

  const selectedSkill = useMemo(() => {
    if (!skills.length) {
      return null;
    }

    return (
      skills.find((skill) => skill.skillId === selectedSkillId) || skills[0]
    );
  }, [skills, selectedSkillId]);

  const isTaskCompleted = (skillId, taskIndex) => {
    return progress.some(
      (item) =>
        item.skillId === skillId &&
        item.taskIndex === taskIndex &&
        item.completed === true,
    );
  };

  const completedTaskCount = selectedSkill
    ? selectedSkill.practice.filter((_, index) =>
        isTaskCompleted(selectedSkill.skillId, index),
      ).length
    : 0;

  const totalTaskCount = selectedSkill?.practice?.length || 0;

  const practiceProgress =
    totalTaskCount > 0
      ? Math.round((completedTaskCount / totalTaskCount) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-[#667085]">
          <Loader2 size={18} className="animate-spin" />
          Loading practice resources...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E1E5EA] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626]">
              <Target size={22} />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-[#20252D]">
              Unable to load practice
            </h2>

            <p className="mt-2 text-xs text-[#667085]">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-[#6072D8] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#5264CC]"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedSkill) {
    return (
      <div className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E1E5EA] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF1FF] text-[#6072D8]">
              <Code2 size={22} />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-[#20252D]">
              No practice tasks available
            </h2>

            <p className="mt-2 text-xs text-[#667085]">
              Complete your career assessment first to unlock personalized
              practice.
            </p>

            <button
              onClick={() => navigate("/career-readiness")}
              className="mt-5 rounded-lg bg-[#6072D8] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#5264CC]"
            >
              Go to assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#6072D8]">
                  <Code2 size={17} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6072D8]">
                  Practice & Projects
                </span>
              </div>

              <h1 className="text-xl font-semibold tracking-tight text-[#20252D] sm:text-2xl">
                Turn your skill gaps into practice
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#667085]">
                Practice the skills that need attention and build practical
                projects to strengthen your profile.
              </p>
            </div>

            <div className="rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Target role
              </p>

              <p className="mt-1 text-sm font-semibold text-[#20252D]">
                {practiceData?.targetRole || "Your target role"}
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Skills sidebar */}
          <aside className="h-fit rounded-2xl border border-[#E1E5EA] bg-white p-4 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#20252D]">
                Skills to practice
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#98A2B3]">
                Focus on the skills that need improvement.
              </p>
            </div>

            <div className="space-y-1.5">
              {skills.map((skill) => {
                const skillCompleted = skill.practice.filter((_, index) =>
                  isTaskCompleted(skill.skillId, index),
                ).length;

                const skillTotal = skill.practice.length;

                const isSelected = skill.skillId === selectedSkill.skillId;

                return (
                  <button
                    key={skill.skillId}
                    onClick={() => setSelectedSkillId(skill.skillId)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      isSelected
                        ? "border-[#C9D0F7] bg-[#EEF1FF]"
                        : "border-transparent hover:border-[#E1E5EA] hover:bg-[#F8F9FB]"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? "bg-white text-[#6072D8]"
                            : "bg-[#F1F3F5] text-[#667085]"
                        }`}
                      >
                        <Code2 size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-[11px] font-semibold ${
                            isSelected ? "text-[#3F4FA8]" : "text-[#344054]"
                          }`}
                        >
                          {skill.skillName}
                        </p>

                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[9px] text-[#98A2B3]">
                            {skillCompleted}/{skillTotal} completed
                          </span>

                          {skillCompleted === skillTotal && skillTotal > 0 && (
                            <CheckCircle2
                              size={13}
                              className="text-[#15803D]"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 space-y-5">
            {/* Selected skill summary */}
            <section className="rounded-2xl border border-[#E1E5EA] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#6072D8]">
                      {selectedSkill.category}
                    </span>

                    <span className="rounded-full bg-[#F4F5F7] px-2.5 py-1 text-[9px] font-medium text-[#667085]">
                      {selectedSkill.status}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-[#20252D]">
                    {selectedSkill.skillName}
                  </h2>

                  <p className="mt-1 text-xs text-[#667085]">
                    {completedTaskCount} of {totalTaskCount} tasks completed
                  </p>
                </div>

                <div className="min-w-[150px] sm:text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#98A2B3]">
                    Practice progress
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#6072D8]">
                    {practiceProgress}%
                  </p>
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E7EAF0]">
                <div
                  className="h-full rounded-full bg-[#6072D8] transition-all duration-500"
                  style={{
                    width: `${practiceProgress}%`,
                  }}
                />
              </div>
            </section>

            {/* Practice tasks */}
            <section className="rounded-2xl border border-[#E1E5EA] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#20252D]">
                    Practice tasks
                  </h3>

                  <p className="mt-1 text-[11px] text-[#98A2B3]">
                    Work through these tasks one by one.
                  </p>
                </div>

                <span className="rounded-lg bg-[#F4F5F7] px-2.5 py-1.5 text-[10px] font-medium text-[#667085]">
                  {totalTaskCount} tasks
                </span>
              </div>

              <div className="space-y-3">
                {selectedSkill.practice.map((task, index) => {
                  const completed = isTaskCompleted(
                    selectedSkill.skillId,
                    index,
                  );

                  return (
                    <PracticeTask
                      key={`${selectedSkill.skillId}-${index}`}
                      task={task}
                      index={index}
                      completed={completed}
                      onPractice={() =>
                        navigate(
                          `/practice/${encodeURIComponent(
                            selectedSkill.skillId,
                          )}/${index}`,
                        )
                      }
                    />
                  );
                })}
              </div>
            </section>

            {/* Project */}
            {selectedSkill.project && (
              <section className="rounded-2xl border border-[#E1E5EA] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#6072D8]">
                      <FolderKanban size={19} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6072D8]">
                          Recommended project
                        </span>

                        <span className="rounded-full bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-medium text-[#667085]">
                          {selectedSkill.project.difficulty}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-base font-semibold text-[#20252D]">
                        {selectedSkill.project.title}
                      </h3>

                      <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#667085]">
                        {selectedSkill.project.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Project implementation can be added later.
                    }}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#DDE1E6] bg-white px-4 py-2.5 text-[11px] font-medium text-[#344054] transition hover:bg-[#F8F9FB]"
                  >
                    <ExternalLink size={13} />
                    View project
                  </button>
                </div>

                {selectedSkill.project.skills?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedSkill.project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#F6F7F9] px-2.5 py-1 text-[9px] font-medium text-[#667085]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#E1E5EA] pt-5">
              <p className="max-w-2xl text-[10px] leading-5 text-[#98A2B3]">
                Practice completion is saved to your Career Lens profile so you
                can continue where you left off.
              </p>

              <button
                onClick={() => navigate("/job-ready")}
                className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-[#6072D8] transition hover:text-[#5264CC]"
              >
                Back to Job Ready
                <ArrowRight size={12} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const PracticeTask = ({ task, index, completed, onPractice }) => {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        completed
          ? "border-[#CDEAD8] bg-[#FAFFFC]"
          : "border-[#E7EAF0] bg-white hover:border-[#D5DAE2] hover:shadow-sm"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            completed
              ? "bg-[#ECFDF3] text-[#15803D]"
              : "bg-[#EEF1FF] text-[#6072D8]"
          }`}
        >
          {completed ? (
            <CheckCircle2 size={15} />
          ) : (
            <span className="text-[11px] font-semibold">{index + 1}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xs font-semibold text-[#20252D]">
              {task.title}
            </h4>

            <span className="rounded-full bg-[#F4F5F7] px-2 py-0.5 text-[9px] font-medium text-[#667085]">
              {task.difficulty}
            </span>

            {completed && (
              <span className="rounded-full bg-[#ECFDF3] px-2 py-0.5 text-[9px] font-semibold text-[#15803D]">
                Completed
              </span>
            )}
          </div>

          <p className="mt-1.5 text-[11px] leading-5 text-[#667085]">
            {task.description}
          </p>
        </div>

        <button
          onClick={onPractice}
          className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[10px] font-medium transition ${
            completed
              ? "border border-[#DDE1E6] bg-white text-[#344054] hover:bg-[#F8F9FB]"
              : "bg-[#6072D8] text-white hover:bg-[#5264CC]"
          }`}
        >
          {completed ? "Review" : "Practice"}
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default Practice;
