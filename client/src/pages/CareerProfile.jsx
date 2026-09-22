import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const skillOptions = [
  "Java",
  "Python",
  "JavaScript",
  "C++",
  "React",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "Git",
  "GitHub",
  "HTML",
  "CSS",
  "AWS",
  "Docker",
];

const CareerProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    college: "",
    branch: "",
    year: "",
    targetRole: "",
    domain: "",
    skills: [],
    githubUrl: "",
    linkedinUrl: "",
    leetcodeUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD EXISTING PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile");

        const profile = response.data?.profile;

        if (profile) {
          setForm({
            college: profile.college || "",
            branch: profile.branch || "",
            year: profile.year || "",
            targetRole: profile.targetRole || "",
            domain: profile.domain || "",
            skills: profile.skills || [],
            githubUrl: profile.githubUrl || "",
            linkedinUrl: profile.linkedinUrl || "",
            leetcodeUrl: profile.leetcodeUrl || "",
          });
        }
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);

        setError(
          err.response?.data?.message || "Unable to load your career profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // TOGGLE SKILL
  // =====================================================

  const toggleSkill = (skill) => {
    setForm((previous) => {
      const alreadySelected = previous.skills.includes(skill);

      return {
        ...previous,

        skills: alreadySelected
          ? previous.skills.filter((item) => item !== skill)
          : [...previous.skills, skill],
      };
    });
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.targetRole) {
      setError("Please select your target role.");
      return;
    }

    if (!form.domain) {
      setError("Please select your preferred domain.");
      return;
    }

    if (form.skills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/profile", form);

      setSuccess("Your User profile has been saved successfully.");

      // Give the user a moment to see success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("PROFILE SAVE ERROR:", err);

      setError(
        err.response?.data?.message || "Unable to save your career profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading your career profile...</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-5xl">
      {/* =============================================== */}
      {/* PAGE HEADER */}
      {/* =============================================== */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-[#6072D8]">Career Profile</p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20252D]">
          Build Student profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
          Tell Career Lens about your education, skills and career goals. We'll
          use this information to understand your career readiness and create a
          personalized path.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================= */}
        {/* EDUCATION */}
        {/* ============================================= */}

        <section className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#20252D]">Education</h2>

            <p className="mt-1 text-sm text-[#667085]">
              Tell us about your current academic background.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* College */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                College
              </label>

              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="Enter your college name"
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              />
            </div>

            {/* Branch */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                Branch
              </label>

              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              >
                <option value="">Select your branch</option>

                <option value="CSE">Computer Science & Engineering</option>

                <option value="CSE-DS">CSE - Data Science</option>

                <option value="CSE-AIML">CSE - AI & Machine Learning</option>

                <option value="IT">Information Technology</option>

                <option value="ECE">Electronics & Communication</option>

                <option value="EEE">Electrical & Electronics</option>

                <option value="Other">Other</option>
              </select>
            </div>

            {/* Year */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                Current Year
              </label>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              >
                <option value="">Select your year</option>

                <option value="1st Year">1st Year</option>

                <option value="2nd Year">2nd Year</option>

                <option value="3rd Year">3rd Year</option>

                <option value="4th Year">4th Year</option>

                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* CAREER GOAL */}
        {/* ============================================= */}

        <section className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#20252D]">
              Career Goal
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Choose the role and domain you want to prepare for.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Target Role */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                Target Role
              </label>

              <select
                name="targetRole"
                value={form.targetRole}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              >
                <option value="">Select target role</option>

                <option value="Software Engineer">Software Engineer</option>

                <option value="Frontend Developer">Frontend Developer</option>

                <option value="Backend Developer">Backend Developer</option>

                <option value="Full Stack Developer">
                  Full Stack Developer
                </option>

                <option value="Data Analyst">Data Analyst</option>

                <option value="Data Scientist">Data Scientist</option>

                <option value="Machine Learning Engineer">
                  Machine Learning Engineer
                </option>

                <option value="DevOps Engineer">DevOps Engineer</option>

                <option value="Cloud Engineer">Cloud Engineer</option>
              </select>
            </div>

            {/* Domain */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                Preferred Domain
              </label>

              <select
                name="domain"
                value={form.domain}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              >
                <option value="">Select domain</option>

                <option value="Software Development">
                  Software Development
                </option>

                <option value="AI & Machine Learning">
                  AI & Machine Learning
                </option>

                <option value="Cloud & DevOps">Cloud & DevOps</option>

                <option value="Cybersecurity">Cybersecurity</option>

                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SKILLS */}
        {/* ============================================= */}

        <section className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#20252D]">
              Current Skills
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Select the technologies and tools you currently know.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillOptions.map((skill) => {
              const selected = form.skills.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "border-[#6072D8] bg-[#EEF1FF] text-[#5264CC]"
                      : "border-[#DDE1E6] bg-white text-[#667085] hover:border-[#6072D8] hover:text-[#5264CC]"
                  }`}
                >
                  {selected && <Check size={15} className="mr-1 inline" />}

                  {skill}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl bg-[#F8F9FB] px-4 py-3">
            <p className="text-xs text-[#667085]">
              Selected skills:
              <span className="ml-1 font-semibold text-[#344054]">
                {form.skills.length}
              </span>
            </p>
          </div>
        </section>

        {/* ============================================= */}
        {/* PROFESSIONAL PROFILES */}
        {/* ============================================= */}

        <section className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#20252D]">
              Professional Profiles
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Optional. Add your profiles so Career Lens can understand your
              existing work and coding activity.
            </p>
          </div>

          <div className="space-y-5">
            {/* GitHub */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                GitHub URL
              </label>

              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              />
            </div>

            {/* LinkedIn */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                LinkedIn URL
              </label>

              <input
                type="url"
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              />
            </div>

            {/* LeetCode */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344054]">
                LeetCode URL
              </label>

              <input
                type="url"
                name="leetcodeUrl"
                value={form.leetcodeUrl}
                onChange={handleChange}
                placeholder="https://leetcode.com/u/username"
                className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
              />
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* MESSAGES */}
        {/* ============================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ============================================= */}
        {/* ACTIONS */}
        {/* ============================================= */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-[#DDE1E6] bg-white px-6 py-3 text-sm font-semibold text-[#344054] transition hover:bg-[#F8F9FB]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving ? "Saving..." : "Save Career Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareerProfile;
