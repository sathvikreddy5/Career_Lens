import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Target,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  RotateCcw,
  Save,
  ArrowRight,
  Code2,
  Database,
  Cloud,
  GitBranch,
  Globe,
  Shield,
  BarChart3,
  Server,
  Layers,
  BookOpen,
} from "lucide-react";

import api from "../services/api";

const iconMap = {
  "Web Fundamentals": Globe,
  JavaScript: Code2,
  "Frontend Framework": Layers,
  "Web & APIs": Globe,
  "Developer Tools": GitBranch,
  Testing: Check,
  Security: Shield,
  Deployment: Cloud,
  "Advanced Frontend": Code2,
  "Interview Preparation": BookOpen,

  Programming: Code2,
  Backend: Server,
  Databases: Database,
  Cloud: Cloud,
  DevOps: Cloud,
  Architecture: Layers,
  "Computer Science": BookOpen,

  Data: Database,
  "Data Tools": BarChart3,
  Python: Code2,
  Mathematics: BarChart3,
  Analytics: BarChart3,
  "Data Processing": Database,
  "Machine Learning": BarChart3,
  "Advanced ML": BarChart3,
  MLOps: Cloud,
  Communication: BookOpen,
};

const priorityWeight = {
  critical: 1,
  high: 2,
  medium: 3,
};

const CareerReadiness = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);

  const [targetRole, setTargetRole] = useState("");
  const [assessments, setAssessments] = useState({});

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // LOAD ROLES
  // ==================================================

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        setError("");

        const response = await api.get("/career/roles");

        setRoles(response.data.roles || []);
      } catch (err) {
        console.error("ROLE LOAD ERROR:", err);

        setError(err.response?.data?.message || "Unable to load career roles.");
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  // ==================================================
  // LOAD PREVIOUS ASSESSMENT
  // ==================================================

  useEffect(() => {
    const loadPreviousAssessment = async () => {
      try {
        setLoadingAssessment(true);

        const response = await api.get("/career/assessment");

        const profile = response.data.profile;

        if (profile) {
          setTargetRole(profile.targetRole);

          const previous = {};

          profile.assessments?.forEach((item) => {
            previous[item.skillId] = item.level;
          });

          setAssessments(previous);
        }
      } catch (err) {
        console.error("PREVIOUS ASSESSMENT ERROR:", err);
      } finally {
        setLoadingAssessment(false);
      }
    };

    loadPreviousAssessment();
  }, []);

  // ==================================================
  // LOAD SKILLS WHEN ROLE CHANGES
  // ==================================================

  useEffect(() => {
    if (!targetRole) {
      setSkills([]);
      return;
    }

    const loadSkills = async () => {
      try {
        setLoadingSkills(true);
        setError("");

        const response = await api.get(`/career/roles/${targetRole}/skills`);

        const loadedSkills = response.data.role?.skills || [];

        setSkills(loadedSkills);

        setAssessments((previous) => {
          const updated = { ...previous };

          loadedSkills.forEach((skill) => {
            if (updated[skill.id] === undefined) {
              updated[skill.id] = 0;
            }
          });

          return updated;
        });
      } catch (err) {
        console.error("SKILLS LOAD ERROR:", err);

        setError(
          err.response?.data?.message || "Unable to load skills for this role.",
        );

        setSkills([]);
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkills();
  }, [targetRole]);

  // ==================================================
  // SELECT ROLE
  // ==================================================

  const handleRoleSelect = (roleId) => {
    setTargetRole(roleId);
    setError("");
    setSuccess("");
  };

  // ==================================================
  // UPDATE SKILL
  // ==================================================

  const updateSkill = (skillId, level) => {
    setAssessments((previous) => ({
      ...previous,
      [skillId]: level,
    }));

    setSuccess("");
  };

  // ==================================================
  // SELECTED ROLE NAME
  // ==================================================

  const selectedRoleName = useMemo(() => {
    return roles.find((role) => role.id === targetRole)?.name || "Not selected";
  }, [roles, targetRole]);

  // ==================================================
  // READINESS
  // ==================================================

  const readiness = useMemo(() => {
    if (!skills.length) {
      return 0;
    }

    const total = skills.reduce(
      (sum, skill) => sum + (assessments[skill.id] || 0),
      0,
    );

    return Math.round((total / (skills.length * 5)) * 100);
  }, [skills, assessments]);

  // ==================================================
  // ASSESSMENT PROGRESS
  // ==================================================

  const assessedCount = useMemo(() => {
    return skills.filter((skill) => (assessments[skill.id] || 0) > 0).length;
  }, [skills, assessments]);

  const allSkillsAssessed =
    skills.length > 0 && assessedCount === skills.length;

  // ==================================================
  // GROUP SKILLS BY CATEGORY
  // ==================================================

  const groupedSkills = useMemo(() => {
    return skills.reduce((groups, skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }

      groups[skill.category].push(skill);

      return groups;
    }, {});
  }, [skills]);

  // ==================================================
  // ROADMAP
  // ==================================================

  const roadmapSkills = useMemo(() => {
    return [...skills]
      .filter((skill) => (assessments[skill.id] || 0) < 4)
      .sort((a, b) => {
        const levelA = assessments[a.id] || 0;
        const levelB = assessments[b.id] || 0;

        if (levelA !== levelB) {
          return levelA - levelB;
        }

        return (
          (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3)
        );
      });
  }, [skills, assessments]);

  // ==================================================
  // SAVE ASSESSMENT
  // ==================================================

  const saveAssessment = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const assessmentData = skills.map((skill) => ({
        skillId: skill.id,
        level: assessments[skill.id] || 0,
      }));

      const response = await api.post("/career/assessment", {
        targetRole,
        assessments: assessmentData,
      });

      setSuccess(
        response.data?.message ||
          "Your assessment has been saved successfully.",
      );

      return true;
    } catch (err) {
      console.error("SAVE ASSESSMENT ERROR:", err);

      setError(
        err.response?.data?.message || "Unable to save your assessment.",
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // SAVE + GO DASHBOARD
  // ==================================================

  const handleGoToDashboard = async () => {
    const saved = await saveAssessment();

    if (saved) {
      navigate("/dashboard");
    }
  };

  // ==================================================
  // RESET
  // ==================================================

  const resetAssessment = () => {
    setStep(1);
    setTargetRole("");
    setSkills([]);
    setAssessments({});
    setError("");
    setSuccess("");
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loadingRoles || loadingAssessment) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[500px] max-w-5xl items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#6B7280]">
            <Loader2 size={20} className="animate-spin" />
            Loading career assessment...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] text-white">
            <Target size={20} />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6366F1]">
            Career readiness
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
            Build your career roadmap
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Choose your target role and assess your current skills. Career Lens
            will identify your skill gaps and create a focused learning roadmap.
          </p>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check size={18} className="mt-0.5 shrink-0" />

            <p>{success}</p>
          </div>
        )}

        {/* ==================================================
            STEP INDICATOR
        ================================================== */}

        <div className="mb-6 flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
              step >= 1
                ? "bg-[#111111] text-white"
                : "bg-[#E5E7EB] text-[#777777]"
            }`}
          >
            {step > 1 ? <Check size={14} /> : "1"}
          </div>

          <div className="h-px w-10 bg-[#D1D5DB]" />

          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
              step >= 2
                ? "bg-[#111111] text-white"
                : "bg-[#E5E7EB] text-[#777777]"
            }`}
          >
            {step > 2 ? <Check size={14} /> : "2"}
          </div>

          <div className="h-px w-10 bg-[#D1D5DB]" />

          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
              step >= 3
                ? "bg-[#111111] text-white"
                : "bg-[#E5E7EB] text-[#777777]"
            }`}
          >
            3
          </div>

          <span className="ml-2 text-[11px] text-[#9CA3AF]">
            {step === 1
              ? "Target role"
              : step === 2
                ? "Skills assessment"
                : "Your roadmap"}
          </span>
        </div>

        {/* ==================================================
            STEP 1 — TARGET ROLE
        ================================================== */}

        {step === 1 && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
              <h2 className="text-[15px] font-semibold text-[#111111]">
                What role are you targeting?
              </h2>

              <p className="mt-1 text-[12px] text-[#6B7280]">
                Career Lens will use the requirements of this role to create
                your assessment.
              </p>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
              {roles.map((role) => {
                const selected = targetRole === role.id;

                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`
                      rounded-xl border p-4 text-left
                      transition
                      ${
                        selected
                          ? "border-[#4F46E5] bg-[#EEF2FF]"
                          : "border-[#E5E7EB] hover:border-[#C7D2FE] hover:bg-[#FAFAFF]"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[13px] font-semibold text-[#111111]">
                          {role.name}
                        </h3>

                        <p className="mt-2 text-[11px] leading-5 text-[#6B7280]">
                          {role.skillCount} role-specific skills included.
                        </p>
                      </div>

                      {selected && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-[#E5E7EB] px-5 py-4 sm:px-6">
              <button
                disabled={!targetRole || loadingSkills}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loadingSkills ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Loading skills
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            STEP 2 — SKILLS
        ================================================== */}

        {step === 2 && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#111111]">
                    Assess your current skills
                  </h2>

                  <p className="mt-1 text-[12px] text-[#6B7280]">
                    Target role:{" "}
                    <span className="font-medium text-[#111111]">
                      {selectedRoleName}
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[11px] text-[#9CA3AF]">
                    Assessment progress
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#111111]">
                    {assessedCount}/{skills.length}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#4F46E5] transition-all"
                  style={{
                    width: `${
                      skills.length ? (assessedCount / skills.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {loadingSkills ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Loader2 size={18} className="animate-spin" />
                    Loading role skills...
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedSkills).map(
                    ([category, categorySkills]) => {
                      const CategoryIcon = iconMap[category] || Code2;

                      return (
                        <div key={category}>
                          {/* Category */}
                          <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#333333]">
                              <CategoryIcon size={16} />
                            </div>

                            <div>
                              <h3 className="text-[13px] font-semibold text-[#111111]">
                                {category}
                              </h3>

                              <p className="text-[10px] text-[#9CA3AF]">
                                {categorySkills.length} skills
                              </p>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="space-y-4">
                            {categorySkills.map((skill) => {
                              const level = assessments[skill.id] || 0;

                              return (
                                <div
                                  key={skill.id}
                                  className="rounded-lg border border-[#E5E7EB] p-4"
                                >
                                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-[12px] font-semibold text-[#111111]">
                                          {skill.name}
                                        </p>

                                        <span
                                          className={`
                                              rounded-full px-2 py-0.5
                                              text-[9px] font-medium uppercase
                                              ${
                                                skill.priority === "critical"
                                                  ? "bg-red-50 text-red-600"
                                                  : skill.priority === "high"
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "bg-blue-50 text-blue-600"
                                              }
                                            `}
                                        >
                                          {skill.priority}
                                        </span>
                                      </div>

                                      <p className="mt-1 text-[10px] text-[#9CA3AF]">
                                        {level === 0
                                          ? "Not assessed"
                                          : level === 5
                                            ? "Strong"
                                            : level >= 3
                                              ? "Developing"
                                              : "Beginner"}
                                      </p>
                                    </div>

                                    <span className="text-[12px] font-semibold text-[#4F46E5]">
                                      {level}/5
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-5 gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                      <button
                                        key={value}
                                        onClick={() =>
                                          updateSkill(skill.id, value)
                                        }
                                        className={`
                                              h-9 rounded-md border
                                              text-[11px] font-medium
                                              transition
                                              ${
                                                level >= value
                                                  ? "border-[#4F46E5] bg-[#4F46E5] text-white"
                                                  : "border-[#E5E7EB] bg-white text-[#777777] hover:border-[#A5B4FC]"
                                              }
                                            `}
                                      >
                                        {value}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            {/* Bottom buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] px-4 py-2.5 text-[12px] font-medium text-[#555555] hover:bg-[#F7F7F7]"
              >
                <ChevronLeft size={15} />
                Back
              </button>

              <button
                disabled={!allSkillsAssessed}
                onClick={() => {
                  setStep(3);
                  setSuccess("");
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-[12px] font-medium text-white hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate roadmap
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            STEP 3 — ROADMAP
        ================================================== */}

        {step === 3 && (
          <div className="space-y-6">
            {/* Readiness */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6366F1]">
                    Your assessment
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[#111111]">
                    Career readiness
                  </h2>

                  <p className="mt-2 text-[12px] text-[#6B7280]">
                    Target role:{" "}
                    <span className="font-medium text-[#111111]">
                      {selectedRoleName}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-[#EEF2FF]">
                    <span className="text-2xl font-semibold text-[#111111]">
                      {readiness}%
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">
                      Overall readiness
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#111111]">
                      {readiness >= 80
                        ? "Strong foundation"
                        : readiness >= 60
                          ? "Getting there"
                          : readiness >= 40
                            ? "Needs development"
                            : "Early stage"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill gap */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] px-5 py-5">
                <h2 className="text-[15px] font-semibold text-[#111111]">
                  Skill gap analysis
                </h2>

                <p className="mt-1 text-[12px] text-[#6B7280]">
                  Your skills are prioritized based on current level and role
                  importance.
                </p>
              </div>

              <div className="divide-y divide-[#F0F0F0]">
                {[...skills]
                  .sort((a, b) => {
                    const levelA = assessments[a.id] || 0;

                    const levelB = assessments[b.id] || 0;

                    if (levelA !== levelB) {
                      return levelA - levelB;
                    }

                    return (
                      (priorityWeight[a.priority] || 3) -
                      (priorityWeight[b.priority] || 3)
                    );
                  })
                  .map((skill) => {
                    const Icon = iconMap[skill.category] || Code2;

                    const level = assessments[skill.id] || 0;

                    return (
                      <div
                        key={skill.id}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#333333]">
                            <Icon size={16} />
                          </div>

                          <div>
                            <p className="text-[12px] font-medium text-[#111111]">
                              {skill.name}
                            </p>

                            <p className="text-[10px] text-[#9CA3AF]">
                              {skill.category} • {skill.priority} priority
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#E5E7EB]">
                            <div
                              className="h-full rounded-full bg-[#4F46E5]"
                              style={{
                                width: `${(level / 5) * 100}%`,
                              }}
                            />
                          </div>

                          <span className="w-8 text-right text-[11px] font-semibold text-[#555555]">
                            {level}/5
                          </span>

                          <span
                            className={`
                              rounded-full px-2.5 py-1
                              text-[10px] font-medium
                              ${
                                level >= 4
                                  ? "bg-[#ECFDF3] text-[#15803D]"
                                  : level >= 3
                                    ? "bg-[#EFF6FF] text-[#2563EB]"
                                    : "bg-[#FFF7ED] text-[#C2410C]"
                              }
                            `}
                          >
                            {level >= 4
                              ? "Strong"
                              : level >= 3
                                ? "Developing"
                                : "Priority"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Roadmap */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                    <Target size={18} />
                  </div>

                  <div>
                    <h2 className="text-[15px] font-semibold text-[#111111]">
                      Recommended roadmap
                    </h2>

                    <p className="text-[11px] text-[#9CA3AF]">
                      Focus on these areas first.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {roadmapSkills.length > 0 ? (
                  roadmapSkills.map((skill, index) => {
                    const Icon = iconMap[skill.category] || Code2;

                    const level = assessments[skill.id] || 0;

                    return (
                      <div
                        key={skill.id}
                        className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-4 sm:gap-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[11px] font-medium text-white">
                          {index + 1}
                        </div>

                        <div className="flex flex-1 items-center gap-3">
                          <Icon
                            size={17}
                            className="hidden text-[#4F46E5] sm:block"
                          />

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[12px] font-medium text-[#111111]">
                                Improve {skill.name}
                              </p>

                              <span className="rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[9px] font-medium text-[#C2410C]">
                                {level}/5
                              </span>
                            </div>

                            <p className="mt-0.5 text-[10px] text-[#9CA3AF]">
                              {skill.category} • {skill.priority} priority
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          size={15}
                          className="shrink-0 text-[#9CA3AF]"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <Check size={30} className="mx-auto text-[#16A34A]" />

                    <p className="mt-3 text-sm font-semibold text-[#111111]">
                      Great foundation!
                    </p>

                    <p className="mt-1 text-xs text-[#6B7280]">
                      Your assessed skills are already at a strong level.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              {/* Save */}
              <button
                onClick={saveAssessment}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-6 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save assessment
                  </>
                )}
              </button>

              {/* Go dashboard */}
              <button
                onClick={handleGoToDashboard}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#111111] bg-white px-6 py-2.5 text-[12px] font-medium text-[#111111] transition hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </button>

              {/* Edit */}
              <button
                onClick={() => setStep(2)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] px-5 py-2.5 text-[12px] font-medium text-[#555555] hover:bg-[#F7F7F7]"
              >
                <ChevronLeft size={15} />
                Edit assessment
              </button>

              {/* Start again */}
              <button
                onClick={resetAssessment}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] px-5 py-2.5 text-[12px] font-medium text-[#555555] hover:bg-[#F7F7F7]"
              >
                <RotateCcw size={14} />
                Start again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerReadiness;
