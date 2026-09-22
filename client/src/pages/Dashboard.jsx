import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Target,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Loader2,
  Code2,
} from "lucide-react";

import Sidebar from "../components/auth/dashboard/Sidebar";
import Header from "../components/auth/dashboard/Header";
import StatCard from "../components/auth/dashboard/StatCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [careerLoading, setCareerLoading] = useState(true);
  const [safetyStats, setSafetyStats] = useState({
    checks: 0,
    alerts: 0,
  });

  // --------------------------------------------------
  // Load Career Readiness data
  // --------------------------------------------------

  useEffect(() => {
    const loadCareerData = async () => {
      try {
        setCareerLoading(true);

        const response = await api.get("/career/assessment");

        setCareerData(response.data.profile);
      } catch (error) {
        console.error("Failed to load career data:", error);

        setCareerData(null);
      } finally {
        setCareerLoading(false);
      }
    };

    loadCareerData();
  }, []);

  // --------------------------------------------------
  // Career calculations
  // --------------------------------------------------
  const assessments = careerData?.assessments || [];

  const totalSkills = assessments.length;

  const assessedSkills = assessments.filter((skill) => skill.level > 0).length;

  const coveredSkills = assessments.filter((skill) => skill.level >= 4).length;

  const pendingSkills = assessments.filter((skill) => skill.level === 0).length;

  const improvementSkills = assessments.filter(
    (skill) => skill.level > 0 && skill.level < 4,
  ).length;

  const skillGaps = assessments.filter((skill) => skill.level < 4);

  // --------------------------------------------------
  // Target role display
  // --------------------------------------------------

  const targetRole = useMemo(() => {
    if (!careerData?.targetRole) {
      return "Not selected";
    }

    return careerData.targetRole
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [careerData]);

  // --------------------------------------------------
  // Top skill gaps
  // --------------------------------------------------

  const topSkillGaps = useMemo(() => {
    return [...skillGaps]
      .sort((a, b) => {
        if (a.level !== b.level) {
          return a.level - b.level;
        }

        const priority = {
          critical: 1,
          high: 2,
          medium: 3,
        };

        return (priority[a.priority] || 3) - (priority[b.priority] || 3);
      })
      .slice(0, 4);
  }, [skillGaps]);

  // --------------------------------------------------
  // Greeting
  // --------------------------------------------------

  const firstName = user?.name?.split(" ")?.[0] || "there";

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Header */}
      <Header setMobileOpen={setMobileOpen} />

      {/* Main */}
      <main className="lg:ml-[250px]">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* ==========================================
              WELCOME
          ========================================== */}

          <section className="mb-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#9CA3AF]">
                  Student overview
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
                  Welcome back, {firstName}
                </h1>

                <p className="mt-2 max-w-xl text-[13px] leading-5 text-[#6B7280]">
                  Track your career progress, identify skill gaps, and stay
                  safer while exploring career opportunities.
                </p>
              </div>

              <button
                onClick={() => navigate("/career-readiness")}
                className="flex w-fit items-center gap-2 rounded-lg bg-[#111111] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#2A2A2A]"
              >
                <Target size={15} />
                Career assessment
              </button>
            </div>
          </section>

          {/* ==========================================
              STAT CARDS
          ========================================== */}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Skills Covered"
              value={careerLoading ? "..." : coveredSkills}
              description={
                totalSkills
                  ? `${assessedSkills} of ${totalSkills} skills assessed`
                  : "No assessment yet"
              }
              icon={CheckCircle}
              accent="green"
            />

            <StatCard
              title="Skills Assessed"
              value={careerLoading ? "..." : `${assessedSkills}/${totalSkills}`}
              description={
                totalSkills
                  ? `${coveredSkills} skills currently covered`
                  : "No assessment yet"
              }
              icon={CheckCircle}
              accent="green"
            />

            <StatCard
              title="Skill Gaps"
              value={careerLoading ? "..." : skillGaps.length}
              description="Areas that need improvement"
              icon={TrendingUp}
              accent="orange"
            />

            <StatCard
              title="Safety Checks"
              value={safetyStats.checks}
              description={
                safetyStats.alerts > 0
                  ? `${safetyStats.alerts} alerts found`
                  : "No safety alerts"
              }
              icon={ShieldCheck}
              accent="green"
            />
          </section>

          {/* ==========================================
              MAIN GRID
          ========================================== */}

          <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            {/* ========================================
                CAREER PROGRESS
            ======================================== */}

            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#111111]">
                    Career progress
                  </h2>

                  <p className="mt-1 text-[11px] text-[#9CA3AF]">
                    Your current skill coverage for the target role
                  </p>
                </div>

                <button
                  onClick={() => navigate("/career-readiness")}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#4F46E5] hover:underline"
                >
                  View assessment
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                {careerLoading ? (
                  <div className="flex min-h-[230px] items-center justify-center">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <Loader2 size={17} className="animate-spin" />
                      Loading career progress...
                    </div>
                  </div>
                ) : careerData ? (
                  <div>
                    {/* Role + Percentage */}
                    {/* Role + Skill Coverage */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[11px] text-[#9CA3AF]">
                          Target role
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-[#111111]">
                          {targetRole}
                        </h3>

                        <p className="mt-3 max-w-md text-[12px] leading-5 text-[#6B7280]">
                          Your assessment shows which skills are covered and
                          which ones need more learning or practice.
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-5 py-4">
                        <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF]">
                          Skills covered
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-[#111111]">
                          {coveredSkills}
                          <span className="text-sm font-normal text-[#9CA3AF]">
                            {" "}
                            / {totalSkills}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Skill status */}
                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-[#FECACA] bg-[#FFF7F7] p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#DC2626]">
                          Pending
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-[#111111]">
                          {pendingSkills}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Skills you haven't covered yet
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#FDE68A] bg-[#FFFCF2] p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#D97706]">
                          Needs improvement
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-[#111111]">
                          {improvementSkills}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Skills that need more practice
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#BBF7D0] bg-[#F5FFF8] p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#16A34A]">
                          Covered
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-[#111111]">
                          {coveredSkills}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Skills currently at a strong level
                        </p>
                      </div>
                    </div>

                    {/* Assessment summary */}
                    <div className="mt-7 rounded-lg bg-[#F8F9FB] p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[12px] font-semibold text-[#111111]">
                            Assessment status
                          </p>

                          <p className="mt-1 text-[10px] text-[#9CA3AF]">
                            {assessedSkills} of {totalSkills} skills have been
                            assessed.
                          </p>
                        </div>

                        <button
                          onClick={() => navigate("/career-readiness")}
                          className="w-fit text-[11px] font-medium text-[#4F46E5] hover:underline"
                        >
                          Reassess skills →
                        </button>
                      </div>
                    </div>

                    {/* Skill stats */}
                    <div className="mt-7 grid grid-cols-3 divide-x divide-[#E5E7EB] border-y border-[#E5E7EB] py-4">
                      <div className="px-3 text-center">
                        <p className="text-lg font-semibold text-[#111111]">
                          {totalSkills}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Total skills
                        </p>
                      </div>

                      <div className="px-3 text-center">
                        <p className="text-lg font-semibold text-[#16A34A]">
                          {coveredSkills}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Covered
                        </p>
                      </div>

                      <div className="px-3 text-center">
                        <p className="text-lg font-semibold text-[#D97706]">
                          {skillGaps.length}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Needs attention
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* No assessment */
                  <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#333333]">
                      <Target size={22} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-[#111111]">
                      Start your career assessment
                    </h3>

                    <p className="mt-1 max-w-sm text-[11px] leading-5 text-[#9CA3AF]">
                      Choose a target role and assess your skills to generate a
                      personalized career roadmap.
                    </p>

                    <button
                      onClick={() => navigate("/career-readiness")}
                      className="mt-4 flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-[11px] font-medium text-white hover:bg-[#2A2A2A]"
                    >
                      Start assessment
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================
                OPPORTUNITY SAFETY
            ======================================== */}

            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#16A34A]">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <h2 className="text-[15px] font-semibold text-[#111111]">
                      Opportunity safety
                    </h2>

                    <p className="mt-1 text-[11px] text-[#9CA3AF]">
                      Protect yourself from suspicious opportunities
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/opportunity-safety")}
                  className="hidden items-center gap-1 text-[11px] font-medium text-[#4F46E5] hover:underline sm:flex"
                >
                  Open
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="p-5">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#16A34A] shadow-sm">
                      <ShieldCheck size={16} />
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#111111]">
                        Stay protected
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[#6B7280]">
                        Verify jobs, internships and offer letters before
                        sharing personal information or making payments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#E5E7EB] p-4">
                    <p className="text-[10px] text-[#9CA3AF]">
                      Checks completed
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[#111111]">
                      {safetyStats.checks}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#E5E7EB] p-4">
                    <p className="text-[10px] text-[#9CA3AF]">Alerts found</p>

                    <p className="mt-1 text-xl font-semibold text-[#111111]">
                      {safetyStats.alerts}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/opportunity-safety")}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] px-4 py-2.5 text-[11px] font-medium text-[#333333] transition hover:bg-[#F7F7F7]"
                >
                  Check an opportunity
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* ==========================================
              LOWER SECTION
          ========================================== */}

          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            {/* ========================================
                SKILL GAPS
            ======================================== */}

            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-5">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#111111]">
                    Recommended for you
                  </h2>

                  <p className="mt-1 text-[11px] text-[#9CA3AF]">
                    Skills that need your attention
                  </p>
                </div>

                <BookOpen size={18} className="text-[#9CA3AF]" />
              </div>

              <div className="p-5">
                {!careerData ? (
                  <div className="py-8 text-center">
                    <p className="text-sm font-medium text-[#111111]">
                      No recommendations yet
                    </p>

                    <p className="mt-1 text-[11px] text-[#9CA3AF]">
                      Complete your career assessment first.
                    </p>

                    <button
                      onClick={() => navigate("/career-readiness")}
                      className="mt-4 text-[11px] font-medium text-[#4F46E5] hover:underline"
                    >
                      Start assessment →
                    </button>
                  </div>
                ) : topSkillGaps.length > 0 ? (
                  <div className="space-y-1">
                    {topSkillGaps.map((skill, index) => (
                      <div
                        key={skill.skillId}
                        className="flex items-center gap-3 border-b border-[#F0F0F0] py-3 last:border-0"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#333333]">
                          <Code2 size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-[12px] font-medium text-[#111111]">
                              {skill.skillName}
                            </p>

                            {skill.priority === "critical" && (
                              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-medium text-red-600">
                                Critical
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 text-[10px] text-[#9CA3AF]">
                            {skill.category}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-[#E5E7EB] sm:block">
                            <div
                              className="h-full rounded-full bg-[#D97706]"
                              style={{
                                width: `${(skill.level / 5) * 100}%`,
                              }}
                            />
                          </div>

                          <span className="rounded-full bg-[#FFF7ED] px-2 py-1 text-[10px] font-medium text-[#C2410C]">
                            {skill.level}/5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                      <CheckCircle size={20} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#111111]">
                      Strong foundation
                    </p>

                    <p className="mt-1 text-[11px] text-[#6B7280]">
                      Your assessed skills are at a strong level.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================
                QUICK ACTIONS
            ======================================== */}

            <div className="rounded-xl border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] px-5 py-5">
                <h2 className="text-[15px] font-semibold text-[#111111]">
                  Quick actions
                </h2>

                <p className="mt-1 text-[11px] text-[#9CA3AF]">
                  Continue building your career readiness
                </p>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {/* Career */}
                <button
                  onClick={() => navigate("/career-readiness")}
                  className="group rounded-lg border border-[#E5E7EB] p-4 text-left transition hover:border-[#C7D2FE] hover:bg-[#FAFAFF]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                      <Target size={17} />
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[#9CA3AF] transition group-hover:translate-x-0.5"
                    />
                  </div>

                  <p className="mt-4 text-[12px] font-semibold text-[#111111]">
                    Update career assessment
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#9CA3AF]">
                    Reassess your skills and update your roadmap.
                  </p>
                </button>

                {/* Safety */}
                <button
                  onClick={() => navigate("/opportunity-safety")}
                  className="group rounded-lg border border-[#E5E7EB] p-4 text-left transition hover:border-[#BBF7D0] hover:bg-[#FAFFFB]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#16A34A]">
                      <ShieldCheck size={17} />
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[#9CA3AF] transition group-hover:translate-x-0.5"
                    />
                  </div>

                  <p className="mt-4 text-[12px] font-semibold text-[#111111]">
                    Verify an opportunity
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#9CA3AF]">
                    Check a job, internship or offer letter for suspicious
                    signals.
                  </p>
                </button>

                {/* Learning */}
                <button
                  onClick={() => navigate("/career-readiness")}
                  className="group rounded-lg border border-[#E5E7EB] p-4 text-left transition hover:border-[#C7D2FE] hover:bg-[#FAFAFF]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                      <BookOpen size={17} />
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[#9CA3AF] transition group-hover:translate-x-0.5"
                    />
                  </div>

                  <p className="mt-4 text-[12px] font-semibold text-[#111111]">
                    Continue learning
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#9CA3AF]">
                    Focus on the skills currently missing from your target role.
                  </p>
                </button>

                {/* Profile */}
                <button
                  onClick={() => navigate("/career-profile")}
                  className="group rounded-lg border border-[#E5E7EB] p-4 text-left transition hover:border-[#D1D5DB] hover:bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#333333]">
                      <CheckCircle size={17} />
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-[#9CA3AF] transition group-hover:translate-x-0.5"
                    />
                  </div>

                  <p className="mt-4 text-[12px] font-semibold text-[#111111]">
                    Complete your profile
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#9CA3AF]">
                    Keep your Career Lens profile information up to date.
                  </p>
                </button>
              </div>
            </div>
          </section>

          {/* ==========================================
              FOOTER NOTE
          ========================================== */}

          <div className="mt-6 flex items-start gap-2 border-t border-[#E5E7EB] pt-5">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-[#9CA3AF]"
            />

            <p className="max-w-3xl text-[10px] leading-5 text-[#9CA3AF]">
              Your Career Lens assessment is based on the skill levels you
              provide. Use it to identify what to learn and practice next; it is
              not a guarantee of employment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
