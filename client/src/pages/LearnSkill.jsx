import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Globe,
  PlayCircle,
  Code2,
  Loader2,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

const resourceIcons = {
  official: Globe,
  documentation: FileText,
  youtube: PlayCircle,
  practice: Code2,
};

const resourceLabels = {
  official: "Official Resource",
  documentation: "Documentation",
  youtube: "Video Tutorial",
  practice: "Practice",
};

const LearnSkill = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/career/roadmap");

        setRoadmap(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load this learning resource.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, []);

  const skill = useMemo(() => {
    const roadmapItems = roadmap?.roadmap || [];

    const decodedSkillId = decodeURIComponent(skillId || "");

    return roadmapItems.find(
      (item) =>
        item.skillId === decodedSkillId ||
        item.skillName?.toLowerCase() === decodedSkillId.toLowerCase(),
    );
  }, [roadmap, skillId]);

  const toggleCompleted = (resourceKey) => {
    setCompleted((current) =>
      current.includes(resourceKey)
        ? current.filter((item) => item !== resourceKey)
        : [...current, resourceKey],
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#667085]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading learning experience...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-72px)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">{error}</p>

          <button
            onClick={() => navigate("/job-ready")}
            className="mt-4 rounded-lg bg-[#6072D8] px-4 py-2 text-sm font-medium text-white hover:bg-[#5264CC]"
          >
            Back to Job Ready
          </button>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-[calc(100vh-72px)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#DDE1E6] bg-white p-8 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-[#6072D8]" />

          <h1 className="mt-4 text-xl font-semibold text-[#20252D]">
            Skill not found
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            This skill is not currently part of your learning roadmap.
          </p>

          <Link
            to="/job-ready"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#6072D8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#5264CC]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Ready
          </Link>
        </div>
      </div>
    );
  }

  const resources = skill.resources || [];
  const completedCount = completed.length;
  const totalItems = resources.length;

  return (
    <div className="min-h-[calc(100vh-72px)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          to="/job-ready"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#667085] transition hover:text-[#6072D8]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Ready
        </Link>

        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-[#DDE1E6] bg-white">
          <div className="bg-[#343A46] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-[#AEB6C3]">
                  <BookOpen className="h-4 w-4" />
                  Learning Experience
                </div>

                <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                  {skill.skillName}
                </h1>

                <p className="mt-2 text-sm text-[#C5CAD3]">
                  {skill.category || "Career Skill"}
                </p>
              </div>

              <div className="rounded-xl bg-[#414854] px-4 py-3">
                <p className="text-xs text-[#AEB6C3]">Current status</p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {skill.status === "missing"
                    ? "Pending"
                    : skill.status === "developing"
                      ? "Needs Improvement"
                      : "Covered"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="border-t border-[#DDE1E6] px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#20252D]">
                  Learning checklist
                </p>

                <p className="mt-1 text-xs text-[#667085]">
                  Complete the resources you finish studying.
                </p>
              </div>

              <span className="text-sm font-semibold text-[#6072D8]">
                {completedCount}/{totalItems}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF1FF]">
              <div
                className="h-full rounded-full bg-[#6072D8] transition-all duration-300"
                style={{
                  width:
                    totalItems === 0
                      ? "0%"
                      : `${(completedCount / totalItems) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Resources */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#20252D]">
                Learn this skill
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Use these resources to strengthen your understanding and
                practice.
              </p>
            </div>

            <div className="space-y-4">
              {resources.map((resource, index) => {
                const key = `${resource.title}-${index}`;
                const Icon = resourceIcons[resource.type] || FileText;

                const isCompleted = completed.includes(key);

                return (
                  <article
                    key={key}
                    className={`rounded-2xl border bg-white p-5 transition ${
                      isCompleted ? "border-[#BFC7F5]" : "border-[#DDE1E6]"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isCompleted
                            ? "bg-[#EEF1FF] text-[#6072D8]"
                            : "bg-[#F1F3F5] text-[#667085]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wide text-[#6072D8]">
                              {resourceLabels[resource.type] || "Resource"}
                            </span>

                            <h3 className="mt-1 text-base font-semibold text-[#20252D]">
                              {resource.title}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleCompleted(key)}
                            className={`inline-flex shrink-0 items-center gap-2 text-sm font-medium ${
                              isCompleted
                                ? "text-[#6072D8]"
                                : "text-[#667085] hover:text-[#6072D8]"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}

                            {isCompleted ? "Completed" : "Mark complete"}
                          </button>
                        </div>

                        {resource.description && (
                          <p className="mt-2 text-sm leading-6 text-[#667085]">
                            {resource.description}
                          </p>
                        )}

                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#6072D8] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#5264CC]"
                          >
                            Open resource
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {resources.length === 0 && (
                <div className="rounded-2xl border border-[#DDE1E6] bg-white p-8 text-center">
                  <BookOpen className="mx-auto h-9 w-9 text-[#A0A7B2]" />

                  <p className="mt-3 text-sm font-medium text-[#20252D]">
                    No resources available yet
                  </p>

                  <p className="mt-1 text-sm text-[#667085]">
                    Learning resources for this skill will be added soon.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#6072D8]" />

                <h2 className="font-semibold text-[#20252D]">
                  Your learning goal
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                Strengthen this skill through the recommended resources, then
                return to your assessment and re-evaluate your level.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5">
              <h2 className="font-semibold text-[#20252D]">Suggested flow</h2>

              <div className="mt-4 space-y-3">
                {[
                  "Understand the fundamentals",
                  "Study the recommended resources",
                  "Practice what you learned",
                  "Build or improve a project",
                  "Re-assess your skill",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-xs font-semibold text-[#6072D8]">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6 text-[#667085]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#DDE1E6] bg-[#EEF1FF] p-5">
              <p className="text-sm font-semibold text-[#20252D]">Keep going</p>

              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Your goal is not just to finish resources. Build enough
                understanding and practice to confidently apply the skill.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LearnSkill;
