import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Loader2,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const roleGroups = [
  {
    category: "Software Development",
    roles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Mobile App Developer",
    ],
  },
  {
    category: "Data & AI",
    roles: [
      "Data Analyst",
      "Data Scientist",
      "Machine Learning Engineer",
      "AI Engineer",
      "Generative AI Engineer",
    ],
  },
  {
    category: "Cloud & DevOps",
    roles: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer"],
  },
  {
    category: "Cybersecurity",
    roles: ["Cybersecurity Analyst", "Security Engineer"],
  },
  {
    category: "Testing & Quality",
    roles: ["QA Engineer", "SDET"],
  },
  {
    category: "Data Engineering",
    roles: ["Data Engineer", "Database Administrator"],
  },
  {
    category: "Networking",
    roles: ["Network Engineer"],
  },
];

const roleDescriptions = {
  "Software Engineer":
    "Build software applications and solve engineering problems using strong programming and computer science fundamentals.",

  "Frontend Developer":
    "Build responsive and interactive user interfaces for modern web applications.",

  "Backend Developer":
    "Build APIs, backend services, databases and scalable server-side applications.",

  "Full Stack Developer":
    "Work across frontend, backend, databases and complete web application development.",

  "Mobile App Developer":
    "Build mobile applications for Android and iOS using modern mobile development technologies.",

  "Data Analyst":
    "Analyze data, discover patterns and communicate insights using analytical tools.",

  "Data Scientist":
    "Use statistics, programming and machine learning to discover insights and solve data-driven problems.",

  "Machine Learning Engineer":
    "Build, train, evaluate and deploy machine learning solutions.",

  "AI Engineer":
    "Build intelligent applications using machine learning, deep learning and AI technologies.",

  "Generative AI Engineer":
    "Build applications powered by large language models, generative AI and modern AI APIs.",

  "DevOps Engineer":
    "Automate software delivery, infrastructure and deployment pipelines.",

  "Cloud Engineer":
    "Design, deploy and maintain applications and infrastructure on cloud platforms.",

  "Site Reliability Engineer":
    "Build reliable, scalable systems and automate monitoring, deployment and infrastructure operations.",

  "Cybersecurity Analyst":
    "Monitor systems, investigate security incidents and protect applications and infrastructure.",

  "Security Engineer":
    "Design and implement security controls for applications, networks and cloud environments.",

  "QA Engineer":
    "Test software applications, identify defects and improve overall product quality.",

  SDET: "Combine software development and testing skills to build automated testing systems.",

  "Data Engineer":
    "Build data pipelines and infrastructure for collecting, processing and transforming data.",

  "Database Administrator":
    "Manage databases, performance, security, backup and recovery.",

  "Network Engineer":
    "Design, configure and maintain reliable computer networks and network security systems.",
};

const levelLabels = {
  0: "Not assessed",
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Strong",
};

const levelDescriptions = {
  0: "Choose the level that best matches your current ability.",
  1: "Little or no hands-on experience.",
  2: "I understand the fundamentals but need guidance.",
  3: "I can use this skill independently for small tasks.",
  4: "I can solve complex problems confidently.",
  5: "I can apply this skill deeply in real-world projects.",
};

const priorityOptions = ["low", "medium", "high"];

const CareerReadiness = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [selectedRole, setSelectedRole] = useState("");
  const [roleSkills, setRoleSkills] = useState([]);
  const [assessments, setAssessments] = useState({});

  const [readiness, setReadiness] = useState(null);
  const [roadmap, setRoadmap] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Existing Assessment
  |--------------------------------------------------------------------------
  */

  const loadAssessment = async () => {
    try {
      const response = await api.get("/career/assessment");

      const data = response.data;

      if (data?.targetRole) {
        setSelectedRole(data.targetRole);
      }

      const existingAssessments = {};

      (data?.assessments || []).forEach((assessment) => {
        existingAssessments[assessment.skillId] = {
          level: assessment.level ?? 0,
          priority: assessment.priority || "medium",
        };
      });

      setAssessments(existingAssessments);
    } catch (err) {
      console.error(
        "Failed to load assessment:",
        err.response?.data || err.message,
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Role Skills
  |--------------------------------------------------------------------------
  */

  const loadRoleSkills = async (role) => {
    if (!role) {
      setRoleSkills([]);
      return;
    }

    try {
      setSkillsLoading(true);
      setError("");

      const response = await api.get(
        `/career/roles/${encodeURIComponent(role)}/skills`,
      );

      const skills = response.data?.skills || [];

      setRoleSkills(skills);

      setAssessments((previous) => {
        const next = { ...previous };

        skills.forEach((skill) => {
          if (!next[skill.id]) {
            next[skill.id] = {
              level: 0,
              priority: "medium",
            };
          }
        });

        return next;
      });
    } catch (err) {
      console.error(
        "Failed to load role skills:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          "Unable to load the skills for this role.",
      );

      setRoleSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Readiness
  |--------------------------------------------------------------------------
  */

  const loadReadiness = async () => {
    try {
      const response = await api.get("/career/readiness");
      setReadiness(response.data);
    } catch (err) {
      console.error(
        "Failed to load readiness:",
        err.response?.data || err.message,
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Roadmap
  |--------------------------------------------------------------------------
  */

  const loadRoadmap = async () => {
    try {
      setRoadmapLoading(true);

      const response = await api.get("/career/roadmap");

      setRoadmap(response.data?.roadmap || []);
    } catch (err) {
      console.error(
        "Failed to load roadmap:",
        err.response?.data || err.message,
      );

      setRoadmap([]);
    } finally {
      setRoadmapLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);

        await loadAssessment();
        await loadReadiness();
        await loadRoadmap();
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Skills When Role Changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (selectedRole) {
      loadRoleSkills(selectedRole);
    }
  }, [selectedRole]);

  /*
  |--------------------------------------------------------------------------
  | Role Filtering
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(
    () => ["All", ...roleGroups.map((group) => group.category)],
    [],
  );

  const filteredRoles = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return roleGroups
      .filter(
        (group) =>
          selectedCategory === "All" || group.category === selectedCategory,
      )
      .map((group) => ({
        ...group,
        roles: group.roles.filter((role) =>
          role.toLowerCase().includes(search),
        ),
      }))
      .filter((group) => group.roles.length > 0);
  }, [searchTerm, selectedCategory]);

  /*
  |--------------------------------------------------------------------------
  | Assessment Counts
  |--------------------------------------------------------------------------
  */

  const assessedCount = useMemo(() => {
    return roleSkills.filter(
      (skill) => Number(assessments[skill.id]?.level || 0) > 0,
    ).length;
  }, [roleSkills, assessments]);

  const assessmentProgress = roleSkills.length
    ? Math.round((assessedCount / roleSkills.length) * 100)
    : 0;

  /*
  |--------------------------------------------------------------------------
  | Select Role
  |--------------------------------------------------------------------------
  */

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
    setSuccess("");
  };

  const handleContinueToAssessment = () => {
    if (!selectedRole) {
      setError("Please select a target role first.");
      return;
    }

    setError("");
    setSuccess("");
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Update Skill
  |--------------------------------------------------------------------------
  */

  const updateSkillLevel = (skillId, level) => {
    setAssessments((previous) => ({
      ...previous,

      [skillId]: {
        ...(previous[skillId] || {}),
        level: Number(level),
        priority: previous[skillId]?.priority || "medium",
      },
    }));
  };

  const updatePriority = (skillId, priority) => {
    setAssessments((previous) => ({
      ...previous,

      [skillId]: {
        ...(previous[skillId] || {}),
        level: previous[skillId]?.level ?? 0,
        priority,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save Assessment
  |--------------------------------------------------------------------------
  */

  const handleSaveAssessment = async () => {
    setError("");
    setSuccess("");

    if (!selectedRole) {
      setError("Please select your target role first.");
      return;
    }

    if (roleSkills.length === 0) {
      setError("No skills are available for the selected role.");
      return;
    }

    const hasAssessedSkill = roleSkills.some(
      (skill) => Number(assessments[skill.id]?.level || 0) > 0,
    );

    if (!hasAssessedSkill) {
      setError("Please assess at least one skill before continuing.");
      return;
    }

    try {
      setSaving(true);

      const assessmentPayload = roleSkills.map((skill) => ({
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        level: Number(assessments[skill.id]?.level || 0),
        priority: assessments[skill.id]?.priority || "medium",
      }));

      await api.post("/career/assessment", {
        targetRole: selectedRole,
        assessments: assessmentPayload,
      });

      await loadReadiness();
      await loadRoadmap();

      setSuccess(
        "Your assessment has been saved. Your personalized path is ready.",
      );

      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Failed to save assessment:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          "Unable to save your assessment. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Change Role
  |--------------------------------------------------------------------------
  */

  const handleChangeRole = () => {
    setStep(1);
    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F1F3F5] px-4 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-24">
          <div className="flex items-center gap-3 text-sm text-[#667085]">
            <Loader2 className="h-5 w-5 animate-spin text-[#6072D8]" />
            Loading your career readiness...
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#F1F3F5]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}

        <header className="mb-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6072D8]">
            <Target className="h-4 w-4" />
            Career Readiness
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#20252D] sm:text-4xl">
            Build your path to your target role
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
            Tell Career Lens where you want to go, assess where you are today,
            and get a focused learning path for what to work on next.
          </p>
        </header>

        {/* ================================================================ */}
        {/* Step Indicator */}
        {/* ================================================================ */}

        <div className="mb-7 rounded-2xl border border-[#DDE1E6] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center">
            {[
              { number: 1, label: "Choose role" },
              { number: 2, label: "Assess skills" },
              { number: 3, label: "Your path" },
            ].map((item, index) => {
              const active = step === item.number;
              const completed = step > item.number;

              return (
                <div key={item.number} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                        active
                          ? "bg-[#6072D8] text-white"
                          : completed
                            ? "bg-[#EEF1FF] text-[#6072D8]"
                            : "bg-[#F1F3F5] text-[#98A2B3]"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        item.number
                      )}
                    </div>

                    <span
                      className={`hidden text-xs font-semibold sm:block ${
                        active
                          ? "text-[#20252D]"
                          : completed
                            ? "text-[#6072D8]"
                            : "text-[#98A2B3]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {index < 2 && (
                    <div
                      className={`mx-3 h-px flex-1 ${
                        step > item.number ? "bg-[#6072D8]" : "bg-[#DDE1E6]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* Alerts */}
        {/* ================================================================ */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* ================================================================ */}
        {/* STEP 1 — CHOOSE ROLE */}
        {/* ================================================================ */}

        {step === 1 && (
          <section className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
            <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
              <p className="text-sm font-semibold text-[#6072D8]">Step 1</p>

              <h2 className="mt-1 text-xl font-semibold text-[#20252D]">
                What role are you preparing for?
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667085]">
                Choose the role you want to work toward. Career Lens will use it
                to identify the skills you should focus on.
              </p>

              {/* Search */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search roles..."
                    className="w-full rounded-xl border border-[#DDE1E6] bg-white py-3 pl-10 pr-4 text-sm text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => {
                  const active = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition ${
                        active
                          ? "bg-[#6072D8] text-white"
                          : "bg-[#F1F3F5] text-[#667085] hover:bg-[#E8EAF0] hover:text-[#20252D]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Cards */}
            <div className="space-y-7 p-5 sm:p-6">
              {filteredRoles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#C9CED6] p-8 text-center">
                  <p className="text-sm font-medium text-[#20252D]">
                    No roles found
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">
                    Try another role name or category.
                  </p>
                </div>
              ) : (
                filteredRoles.map((group) => (
                  <div key={group.category}>
                    <h3 className="mb-3 text-sm font-semibold text-[#20252D]">
                      {group.category}
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.roles.map((role) => {
                        const selected = selectedRole === role;

                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleSelect(role)}
                            className={`group rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-[#6072D8] bg-[#EEF1FF] shadow-sm"
                                : "border-[#DDE1E6] bg-white hover:-translate-y-0.5 hover:border-[#91A0F0] hover:bg-[#F8F9FF] hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    selected
                                      ? "text-[#5264CC]"
                                      : "text-[#20252D]"
                                  }`}
                                >
                                  {role}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-[#667085]">
                                  {roleDescriptions[role]}
                                </p>
                              </div>

                              {selected && (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#6072D8]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Continue */}
            <div className="flex flex-col gap-3 border-t border-[#E1E5EA] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-semibold text-[#20252D]">
                  {selectedRole || "No role selected"}
                </p>

                <p className="mt-1 text-xs text-[#667085]">
                  {selectedRole
                    ? "Continue to assess the skills required for this role."
                    : "Select a role to continue."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinueToAssessment}
                disabled={!selectedRole}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* STEP 2 — ASSESS SKILLS */}
        {/* ================================================================ */}

        {step === 2 && (
          <section className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
            {/* Assessment Header */}
            <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6072D8]">Step 2</p>

                  <h2 className="mt-1 text-xl font-semibold text-[#20252D]">
                    Assess your current skills
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667085]">
                    Be honest about your current ability. You can update your
                    assessment later as you improve.
                  </p>
                </div>

                <div className="rounded-xl bg-[#EEF1FF] px-4 py-3 sm:min-w-[150px]">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                    Target role
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#6072D8]">
                    {selectedRole}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#667085]">
                    Assessment progress
                  </p>

                  <p className="text-xs font-bold text-[#6072D8]">
                    {assessedCount} of {roleSkills.length} assessed
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E1E5EA]">
                  <div
                    className="h-full rounded-full bg-[#6072D8] transition-all"
                    style={{
                      width: `${assessmentProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Loading */}
            {skillsLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="flex items-center gap-3 text-sm text-[#667085]">
                  <Loader2 className="h-5 w-5 animate-spin text-[#6072D8]" />
                  Loading required skills...
                </div>
              </div>
            ) : roleSkills.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#667085]">
                No skills found for this role.
              </div>
            ) : (
              <div className="divide-y divide-[#E1E5EA]">
                {roleSkills.map((skill, index) => {
                  const currentLevel = Number(
                    assessments[skill.id]?.level || 0,
                  );

                  const currentPriority =
                    assessments[skill.id]?.priority || "medium";

                  return (
                    <div key={skill.id} className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* Skill */}
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F3F5] text-sm font-semibold text-[#667085]">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#20252D]">
                              {skill.name}
                            </h3>

                            <p className="mt-1 text-xs text-[#667085]">
                              {skill.category}
                            </p>

                            {skill.weight && (
                              <p className="mt-1 text-[11px] text-[#98A2B3]">
                                Importance: {skill.weight}%
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="w-full lg:max-w-[470px]">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-[#667085]">
                              Your level
                            </label>

                            <span className="text-xs font-semibold text-[#6072D8]">
                              {levelLabels[currentLevel]}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((level) => {
                              const selected = currentLevel === level;

                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() =>
                                    updateSkillLevel(skill.id, level)
                                  }
                                  className={`rounded-lg border px-2 py-2 text-center transition ${
                                    selected
                                      ? "border-[#6072D8] bg-[#EEF1FF] text-[#5264CC]"
                                      : "border-[#DDE1E6] bg-white text-[#667085] hover:border-[#91A0F0] hover:bg-[#F8F9FF]"
                                  }`}
                                >
                                  <span
                                    className={`block text-sm font-bold ${
                                      selected
                                        ? "text-[#6072D8]"
                                        : "text-[#667085]"
                                    }`}
                                  >
                                    {level}
                                  </span>

                                  <span className="mt-0.5 block truncate text-[9px] font-medium sm:text-[10px]">
                                    {levelLabels[level]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <p className="mt-2 text-[11px] leading-5 text-[#98A2B3]">
                            {levelDescriptions[currentLevel]}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <label className="text-[11px] font-medium text-[#667085]">
                              Priority
                            </label>

                            <div className="relative flex-1 sm:max-w-[180px]">
                              <select
                                value={currentPriority}
                                onChange={(event) =>
                                  updatePriority(skill.id, event.target.value)
                                }
                                className="w-full appearance-none rounded-lg border border-[#DDE1E6] bg-white px-3 py-2 pr-8 text-xs capitalize text-[#20252D] outline-none transition focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
                              >
                                {priorityOptions.map((priority) => (
                                  <option key={priority} value={priority}>
                                    {priority}
                                  </option>
                                ))}
                              </select>

                              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#667085]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#E1E5EA] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <button
                type="button"
                onClick={handleChangeRole}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE1E6] bg-white px-5 py-3 text-sm font-semibold text-[#667085] transition hover:border-[#91A0F0] hover:text-[#20252D]"
              >
                <ArrowLeft className="h-4 w-4" />
                Change role
              </button>

              <button
                type="button"
                onClick={handleSaveAssessment}
                disabled={saving || skillsLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Building your path...
                  </>
                ) : (
                  <>
                    Generate my career path
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* STEP 3 — CAREER SNAPSHOT */}
        {/* ================================================================ */}

        {step === 3 && (
          <>
            {/* Snapshot Header */}
            <section className="mb-7 rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#6072D8]">
                    <CheckCircle2 className="h-4 w-4" />
                    Your Career Snapshot
                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-[#20252D]">
                    {selectedRole}
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667085]">
                    Here's where you currently stand and what Career Lens
                    recommends focusing on next.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE1E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] transition hover:border-[#91A0F0] hover:text-[#20252D]"
                >
                  Edit assessment
                </button>
              </div>
            </section>

            {/* Result Cards */}
            {readiness && (
              <section className="mb-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>

                    <p className="mt-4 text-sm text-[#667085]">Covered</p>

                    <p className="mt-1 text-3xl font-bold text-[#20252D]">
                      {readiness.coveredCount || 0}
                    </p>

                    <p className="mt-1 text-xs text-[#98A2B3]">
                      Skills you're already comfortable with
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>

                    <p className="mt-4 text-sm text-[#667085]">Developing</p>

                    <p className="mt-1 text-3xl font-bold text-[#20252D]">
                      {readiness.developingCount || 0}
                    </p>

                    <p className="mt-1 text-xs text-[#98A2B3]">
                      Skills that need more practice
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>

                    <p className="mt-4 text-sm text-[#667085]">Missing</p>

                    <p className="mt-1 text-3xl font-bold text-[#20252D]">
                      {readiness.missingCount || 0}
                    </p>

                    <p className="mt-1 text-xs text-[#98A2B3]">
                      Skills to start learning
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Skill Gaps */}
            {readiness?.skillGaps?.length > 0 && (
              <section className="mb-8">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-[#20252D]">
                    Focus on these skills
                  </h2>

                  <p className="mt-1 text-sm text-[#667085]">
                    These are the areas Career Lensrecommends you work on based
                    on your assessment.
                  </p>
                </div>

                <div className="space-y-3">
                  {readiness.skillGaps.map((gap, index) => (
                    <div
                      key={gap.skillId || index}
                      className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-sm font-semibold text-[#6072D8]">
                            {index + 1}
                          </div>

                          <div>
                            <h3 className="font-semibold text-[#20252D]">
                              {gap.skillName}
                            </h3>

                            <p className="mt-1 text-xs text-[#667085]">
                              {gap.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#667085]">
                            Level {gap.level}/5
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                              gap.priority === "high"
                                ? "bg-red-50 text-red-600"
                                : gap.priority === "medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {gap.priority || "medium"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E1E5EA]">
                        <div
                          className="h-full rounded-full bg-[#6072D8]"
                          style={{
                            width: `${(Number(gap.level || 0) / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Roadmap */}
            <section className="mb-10">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#6072D8]" />

                  <h2 className="text-xl font-semibold text-[#20252D]">
                    Your personalized roadmap
                  </h2>
                </div>

                <p className="mt-1 text-sm text-[#667085]">
                  Follow these steps to turn your skill gaps into practical
                  progress.
                </p>
              </div>

              {roadmapLoading ? (
                <div className="rounded-2xl border border-[#DDE1E6] bg-white p-10 text-center shadow-sm">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#6072D8]" />

                  <p className="mt-3 text-sm text-[#667085]">
                    Building your personalized roadmap...
                  </p>
                </div>
              ) : roadmap.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#C9CED6] bg-white p-8 text-center">
                  <BookOpen className="mx-auto h-6 w-6 text-[#6072D8]" />

                  <h3 className="mt-3 font-semibold text-[#20252D]">
                    No learning steps yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
                    Complete your skill assessment to generate a personalized
                    learning path.
                  </p>
                </div>
              ) : (
                <div className="relative space-y-4">
                  {roadmap.map((item, index) => (
                    <div
                      key={item.skillId || `${item.skillName}-${index}`}
                      className="relative overflow-hidden rounded-2xl border border-[#DDE1E6] bg-white shadow-sm"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6072D8] text-sm font-bold text-white">
                              {item.order || index + 1}
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6072D8]">
                                Step {item.order || index + 1}
                              </p>

                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-[#20252D]">
                                  {item.skillName}
                                </h3>

                                <span className="rounded-full bg-[#F1F3F5] px-2.5 py-1 text-xs text-[#667085]">
                                  {item.category}
                                </span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-[#667085]">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              item.priority === "high"
                                ? "bg-red-50 text-red-600"
                                : item.priority === "medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.priority || "medium"} priority
                          </span>
                        </div>

                        {/* Current level */}
                        <div className="mt-5 rounded-xl bg-[#F6F7F9] p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#667085]">
                              Current skill level
                            </span>

                            <span className="text-sm font-bold text-[#6072D8]">
                              {item.currentLevel}/5
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E1E5EA]">
                            <div
                              className="h-full rounded-full bg-[#6072D8]"
                              style={{
                                width: `${
                                  (Number(item.currentLevel || 0) / 5) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Resources */}
                        {item.resources?.length > 0 && (
                          <div className="mt-5">
                            <div className="mb-3 flex items-start gap-2">
                              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#6072D8]" />

                              <div>
                                <p className="text-sm font-semibold text-[#20252D]">
                                  Recommended learning
                                </p>

                                <p className="mt-1 text-xs text-[#667085]">
                                  Learn the concept, then practice it.
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {item.resources.map((resource, resourceIndex) => (
                                <a
                                  key={`${item.skillId}-${resourceIndex}`}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between gap-3 rounded-xl border border-[#DDE1E6] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#6072D8] hover:bg-[#F8F9FF] hover:shadow-sm"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-[#20252D] group-hover:text-[#5264CC]">
                                      {resource.title}
                                    </p>

                                    <p className="mt-1 text-xs capitalize text-[#667085]">
                                      {resource.type}
                                    </p>
                                  </div>

                                  <ExternalLink className="h-4 w-4 shrink-0 text-[#667085] group-hover:text-[#6072D8]" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/learn/${encodeURIComponent(item.skillId)}`,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5264CC]"
                          >
                            <BookOpen className="h-4 w-4" />
                            Learn
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/practice/${encodeURIComponent(
                                  item.skillId,
                                )}/0`,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE1E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] transition hover:border-[#91A0F0] hover:text-[#20252D]"
                          >
                            <GraduationCap className="h-4 w-4" />
                            Practice
                          </button>
                        </div>

                        {/* Why */}
                        {item.reason && (
                          <div className="mt-5 rounded-xl bg-[#F8F9FA] p-4">
                            <p className="text-xs leading-5 text-[#667085]">
                              <span className="font-semibold text-[#20252D]">
                                Why this is here:
                              </span>{" "}
                              {item.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Reassessment */}
                  <div className="rounded-2xl border border-[#DDE1E6] bg-[#EEF1FF] p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
                        <CheckCircle2 className="h-5 w-5 text-[#6072D8]" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-[#20252D]">
                          Learn → Practice → Reassess
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                          Come back and update your assessment as your skills
                          improve. Career Lens can then identify what you should
                          focus on next.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default CareerReadiness;
