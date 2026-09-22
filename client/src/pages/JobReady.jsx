import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Code2,
  ExternalLink,
  GraduationCap,
  Loader2,
  RefreshCw,
  Target,
  XCircle,
} from "lucide-react";

import api from "../services/api";

const JobReady = () => {
  const navigate = useNavigate();

  const [readiness, setReadiness] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [practiceData, setPracticeData] = useState(null);
  const [practiceSummary, setPracticeSummary] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Data
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {
    try {
      setError("");

      const [
        readinessResponse,
        roadmapResponse,
        practiceResponse,
        practiceSummaryResponse,
      ] = await Promise.all([
        api.get("/career/readiness"),
        api.get("/career/roadmap"),
        api.get("/practice"),
        api.get("/practice/summary"),
      ]);

      setReadiness(readinessResponse.data);
      setRoadmap(roadmapResponse.data);
      setPracticeData(practiceResponse.data);
      setPracticeSummary(practiceSummaryResponse.data?.summary || []);
    } catch (err) {
      console.error("Job Ready load error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load your Job Ready information.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  /*
  |--------------------------------------------------------------------------
  | Derived Data
  |--------------------------------------------------------------------------
  */

  const roadmapItems = useMemo(() => roadmap?.roadmap || [], [roadmap]);

  const practiceItems = useMemo(
    () => practiceData?.practice || [],
    [practiceData],
  );

  const missingSkills = readiness?.missingSkills || [];
  const developingSkills = readiness?.developingSkills || [];
  const coveredSkills = readiness?.coveredSkills || [];

  /*
  |--------------------------------------------------------------------------
  | Practice Helpers
  |--------------------------------------------------------------------------
  */

  const getPracticeForSkill = (skillId) => {
    return practiceItems.find(
      (item) =>
        item.skillId === skillId ||
        item.skillName?.toLowerCase() === skillId?.toLowerCase(),
    );
  };

  const getPracticeProgress = (skillId) => {
    const practiceSkill = getPracticeForSkill(skillId);

    if (!practiceSkill) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
      };
    }

    const summary = practiceSummary.find((item) => item.skillId === skillId);

    const total = practiceSkill.practice?.length || 0;
    const completed = summary?.completedTasks || 0;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Select What Student Should Work On
  |--------------------------------------------------------------------------
  */

  const focusSkills = useMemo(() => {
    if (!roadmapItems.length) {
      return [];
    }

    return roadmapItems.slice(0, 4);
  }, [roadmapItems]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F1F3F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-56 rounded-lg bg-gray-200" />

          <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />

          <div className="mt-8 h-40 rounded-2xl bg-white" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="h-32 rounded-2xl bg-white" />
            <div className="h-32 rounded-2xl bg-white" />
            <div className="h-32 rounded-2xl bg-white" />
          </div>

          <div className="mt-8 h-72 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F1F3F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-800">
                  Could not load Job Ready
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-700">{error}</p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6072D8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5264CC] disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Assessment
  |--------------------------------------------------------------------------
  */

  if (!readiness?.targetRole) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F1F3F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-[#DDE1E6] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1FF]">
              <Target className="h-7 w-7 text-[#6072D8]" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#20252D]">
              Start your job-readiness journey
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#667085]">
              Choose your target role and assess your current skills first.
              Career Lens will then create a focused preparation path for you.
            </p>

            <button
              type="button"
              onClick={() => navigate("/career-readiness")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6072D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC]"
            >
              Start Career Assessment
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F1F3F5] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}

        <header className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#6072D8]">
                <GraduationCap className="h-4 w-4" />
                Job Ready
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#20252D] sm:text-4xl">
                Prepare for your target role
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
                Learn the skills you need, practice them through hands-on tasks,
                and keep improving your preparation over time.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#DDE1E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] shadow-sm transition hover:text-[#20252D] disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* Target Role */}
        {/* ================================================================ */}

        <section className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF]">
                <Target className="h-6 w-6 text-[#6072D8]" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                  Preparing for
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#20252D]">
                  {readiness.targetRole}
                </h2>

                <p className="mt-1 text-xs text-[#667085]">
                  Your preparation is based on your latest skill assessment.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/career-readiness")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE1E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] transition hover:border-[#91A0F0] hover:text-[#20252D]"
            >
              Update assessment
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Snapshot */}
        {/* ================================================================ */}

        <section className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <SnapshotCard
              icon={XCircle}
              title="Skills to learn"
              value={missingSkills.length}
              description="Start with these skills"
              iconClass="bg-red-50 text-red-600"
            />

            <SnapshotCard
              icon={CircleAlert}
              title="Skills to improve"
              value={developingSkills.length}
              description="Practice these skills more"
              iconClass="bg-amber-50 text-amber-600"
            />

            <SnapshotCard
              icon={CheckCircle2}
              title="Skills covered"
              value={coveredSkills.length}
              description="Already covered in your assessment"
              iconClass="bg-green-50 text-green-600"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Next Focus */}
        {/* ================================================================ */}

        <section className="mt-9">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#6072D8]" />

              <h2 className="text-xl font-bold text-[#20252D]">
                Your next focus
              </h2>
            </div>

            <p className="mt-1 text-sm leading-6 text-[#667085]">
              Start with these skills based on your current assessment and
              priority.
            </p>
          </div>

          {focusSkills.length === 0 ? (
            <EmptyFocus onAssessment={() => navigate("/career-readiness")} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {focusSkills.map((item, index) => {
                const practiceProgress = getPracticeProgress(item.skillId);

                return (
                  <FocusCard
                    key={item.skillId || `${item.skillName}-${index}`}
                    item={item}
                    index={index}
                    practiceProgress={practiceProgress}
                    onLearn={() =>
                      navigate(`/learn/${encodeURIComponent(item.skillId)}`)
                    }
                    onPractice={() =>
                      navigate(
                        `/practice?skill=${encodeURIComponent(item.skillId)}`,
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* Recommended Learning */}
        {/* ================================================================ */}

        {focusSkills.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#6072D8]" />

                <h2 className="text-xl font-bold text-[#20252D]">
                  Recommended learning
                </h2>
              </div>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Use these resources to strengthen the skills you need for your
                target role.
              </p>
            </div>

            <div className="space-y-4">
              {focusSkills.map((item, index) => (
                <LearningSection
                  key={item.skillId || `${item.skillName}-learning-${index}`}
                  item={item}
                />
              ))}
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* Practice CTA */}
        {/* ================================================================ */}

        <section className="mt-10 pb-8">
          <div className="overflow-hidden rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF]">
                    <Code2 className="h-5 w-5 text-[#6072D8]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#20252D]">
                      Practice what you learn
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-[#667085]">
                      Move from learning to hands-on practice. Your completed
                      tasks are saved so you can continue later.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/practice")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC]"
                >
                  Open Practice
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ======================================================================== */
/* SNAPSHOT CARD */
/* ======================================================================== */

const SnapshotCard = ({ icon: Icon, title, value, description, iconClass }) => {
  return (
    <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#667085]">{title}</p>

          <p className="mt-2 text-3xl font-bold text-[#20252D]">{value}</p>

          <p className="mt-1 text-xs leading-5 text-[#98A2B3]">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

/* ======================================================================== */
/* EMPTY FOCUS */
/* ======================================================================== */

const EmptyFocus = ({ onAssessment }) => {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <div>
            <h3 className="font-semibold text-green-800">
              No skill gaps are currently in your roadmap
            </h3>

            <p className="mt-1 text-sm leading-6 text-green-700">
              Keep practicing your existing skills and reassess them as you
              continue learning.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAssessment}
          className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
        >
          Reassess skills
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ======================================================================== */
/* FOCUS CARD */
/* ======================================================================== */

const FocusCard = ({ item, index, practiceProgress, onLearn, onPractice }) => {
  const level = Number(item.currentLevel || 0);

  const status =
    level === 0
      ? {
          label: "Start learning",
          className: "bg-red-50 text-red-600",
        }
      : {
          label: "Needs practice",
          className: "bg-amber-50 text-amber-600",
        };

  const hasPractice = practiceProgress.total > 0;

  return (
    <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6072D8] text-sm font-bold text-white">
            {index + 1}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-[#20252D]">
                {item.skillName}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            <p className="mt-1 text-xs text-[#667085]">{item.category}</p>
          </div>
        </div>

        <span className="shrink-0 text-sm font-bold text-[#6072D8]">
          {level}/5
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#667085]">
        {item.reason ||
          item.description ||
          `Improve your ${item.skillName} skills through learning and practice.`}
      </p>

      {/* Skill level */}
      <div className="mt-4">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <div
              key={value}
              className={`h-1.5 flex-1 rounded-full ${
                value <= level ? "bg-[#6072D8]" : "bg-[#E1E5EA]"
              }`}
            />
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-[#98A2B3]">
          <span>Current level</span>

          <span>
            {level === 0
              ? "Not assessed"
              : level === 1
                ? "Beginner"
                : level === 2
                  ? "Basic"
                  : level === 3
                    ? "Intermediate"
                    : level === 4
                      ? "Advanced"
                      : "Strong"}
          </span>
        </div>
      </div>

      {/* Practice */}
      {hasPractice && (
        <div className="mt-5 rounded-xl bg-[#F8F9FB] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#6072D8]" />

              <span className="text-xs font-semibold text-[#20252D]">
                Practice
              </span>
            </div>

            <span className="text-xs font-bold text-[#6072D8]">
              {practiceProgress.completed}/{practiceProgress.total}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E1E5EA]">
            <div
              className="h-full rounded-full bg-[#6072D8] transition-all"
              style={{
                width: `${practiceProgress.percentage}%`,
              }}
            />
          </div>

          <p className="mt-2 text-[10px] text-[#667085]">
            {practiceProgress.percentage}% of practice tasks completed
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onLearn}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5264CC]"
        >
          <BookOpen className="h-4 w-4" />
          Learn
        </button>

        <button
          type="button"
          onClick={onPractice}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DDE1E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] transition hover:border-[#91A0F0] hover:text-[#20252D]"
        >
          <Code2 className="h-4 w-4" />
          Practice
        </button>
      </div>
    </div>
  );
};

/* ======================================================================== */
/* LEARNING SECTION */
/* ======================================================================== */

const LearningSection = ({ item }) => {
  if (!item.resources?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF]">
          <BookOpen className="h-5 w-5 text-[#6072D8]" />
        </div>

        <div>
          <h3 className="font-semibold text-[#20252D]">{item.skillName}</h3>

          <p className="mt-1 text-xs text-[#667085]">{item.category}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {item.resources.map((resource, index) => (
          <a
            key={`${resource.title}-${index}`}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#DDE1E6] bg-[#F8F9FB] p-4 transition hover:border-[#91A0F0] hover:bg-[#EEF1FF]"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#20252D] group-hover:text-[#5264CC]">
                {resource.title}
              </p>

              <p className="mt-1 text-[10px] capitalize text-[#667085]">
                {resource.type || "Resource"}
              </p>
            </div>

            <ExternalLink className="h-4 w-4 shrink-0 text-[#667085] group-hover:text-[#6072D8]" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default JobReady;
