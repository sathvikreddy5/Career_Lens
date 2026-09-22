import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(formData.email.trim(), formData.password);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090A0C] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      {/* Large subtle circles */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/[0.035]" />

      <div className="pointer-events-none absolute left-[25%] -top-32 h-[600px] w-[600px] rounded-full border border-white/[0.025]" />

      <div className="pointer-events-none absolute -bottom-72 left-[20%] h-[700px] w-[700px] rounded-full border border-white/[0.03]" />

      {/* =====================================================
          MOUNTAIN / ABSTRACT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[55%] overflow-hidden">
        {/* Mountain 1 */}
        <div
          className="
            absolute
            bottom-[-15%]
            left-[8%]
            h-[75%]
            w-[42%]
            rotate-[-4deg]
            bg-gradient-to-t
          from-[#050608]
          via-[#0C0E11]
          to-[#171A1F]
            opacity-45
          "
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Mountain 2 */}
        <div
          className="
            absolute
            bottom-[-10%]
            left-[27%]
            h-[90%]
            w-[45%]
            rotate-[5deg]
            bg-gradient-to-t
            from-[#050608]
            via-[#16191E]
            to-[#292D33]
            opacity40
          "
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Mountain 3 */}
        <div
          className="
            absolute
            bottom-[-20%]
            right-[8%]
            h-[78%]
            w-[42%]
            rotate-[5deg]
            bg-gradient-to-t
            from-[#050608]
            via-[#111317]
            to-[#24272C]
            opacity40
          "
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Mountain lines */}
        <div className="absolute bottom-[8%] left-[30%] h-[30%] w-px rotate-[28deg] bg-white/[0.08]" />

        <div className="absolute bottom-[12%] left-[45%] h-[38%] w-px rotate-[20deg] bg-white/[0.06]" />

        <div className="absolute bottom-[5%] right-[30%] h-[32%] w-px rotate-[-20deg] bg-white/[0.06]" />

        {/* Fade into black */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-transparent to-transparent" />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 min-h-screen px-6 py-7 sm:px-10 lg:px-14 xl:px-20">
        {/* =================================================
            HEADER
        ================================================== */}

        <header className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <Shield size={22} strokeWidth={1.7} className="text-white" />
            </div>

            <div>
              <h1 className="text-[18px] font-semibold tracking-tight">
                Career Lens{" "}
              </h1>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.24em] text-white/35">
                Career Intelligence
              </p>
            </div>
          </div>

          {/* Top navigation */}
          <div className="hidden items-center gap-7 text-[9px] font-medium uppercase tracking-[0.2em] text-white/35 sm:flex">
            <span>Learn</span>
            <span>Prepare</span>
            <span>Verify</span>
            <span>Stay Safe</span>
          </div>
        </header>

        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        <main className="relative flex min-h-[calc(100vh-125px)] items-center">
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <section className="w-full max-w-[650px] pb-16 pt-20 lg:pb-20 lg:pt-12">
            {/* Eyebrow */}
            <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Learn · Prepare · Verify
            </p>

            {/* Main heading */}
            <h2 className="max-w-[560px] text-5xl font-bold leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-[60px] xl:text-[66px]">
              {" "}
              Build skills ·
              <br />
              Find opportunities ·
              <br />
              <span className="text-white/35">Verify them ·</span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-[560px] text-sm leading-6 text-white/45 sm:text-[15px]">
              Career Lens helps you identify skill gaps, prepare for your target
              role, and verify career opportunities.
            </p>

            {/* Small divider */}
            <div className="mt-9 h-px w-10 bg-white/50" />

            {/* Features */}
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-5">
              <Feature
                icon={<Shield size={17} strokeWidth={1.6} />}
                title="Trusted Platform"
                subtitle="Career protection"
              />

              <Feature
                icon={<Users size={17} strokeWidth={1.6} />}
                title="Real Opportunities"
                subtitle="Safer discovery"
              />

              <Feature
                icon={<Lock size={17} strokeWidth={1.6} />}
                title="Safer Community"
                subtitle="Stay protected"
              />
            </div>

            {/* Quote */}
            <p className="mt-8 text-xs italic text-white/25">
              See your skills. Understand your path. Move forward.
            </p>
          </section>

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <section className="absolute right-[2%] top-1/2 w-[500px] max-w-[calc(100vw-40px)] -translate-y-1/2 xl:right-[4%] 2xl:right-[7%]">
            {" "}
            <div className="relative overflow-hidden rounded-[20px] bg-white px-8 py-7 text-[#111214] shadow-[0_25px_80px_rgba(0,0,0,0.5)] sm:px-9 sm:py-8">
              {" "}
              {/* Card decorative circle */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-[#F1F2F4]" />
              <div className="relative z-10">
                {/* Heading */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#858A92]">
                    Welcome back
                  </p>

                  <h3 className="mt-3 text-[27px] font-bold tracking-[-0.04em] text-[#0D0E10] sm:text-[29px]">
                    {" "}
                    Sign in to Career Lens
                  </h3>

                  <p className="mt-2 max-w-[320px] text-[13px] leading-5 text-[#737982]">
                    {" "}
                    Continue building your skills and navigating your career
                    journey.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[#17191C]"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A9]"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-lg border border-[#D9DDE2] bg-[#FAFAFB] pl-11 pr-4 text-sm text-[#111214] outline-none transition placeholder:text-[#A2A8B1] focus:border-[#111214] focus:bg-white focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-[#17191C]"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-sm text-[#6F747C] transition hover:text-[#111214]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock
                        size={17}
                        strokeWidth={1.7}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A9]"
                      />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="h-11 w-full rounded-lg border border-[#D9DDE2] bg-[#FAFAFB] pl-11 pr-12 text-sm text-[#111214] outline-none transition placeholder:text-[#A2A8B1] focus:border-[#111214] focus:bg-white focus:ring-2 focus:ring-black/5"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#969CA5] hover:text-[#111214]"
                      >
                        {showPassword ? (
                          <EyeOff size={17} strokeWidth={1.7} />
                        ) : (
                          <Eye size={17} strokeWidth={1.7} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember */}
                  <div className="flex items-center gap-2">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 accent-black"
                    />

                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-[#777D85]"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Sign in */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#090A0C] text-sm font-medium text-white transition hover:bg-[#1B1D20] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight
                          size={17}
                          strokeWidth={1.7}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#E4E6E9]" />

                  <span className="text-[11px] text-[#9DA2A9]">OR</span>

                  <div className="h-px flex-1 bg-[#E4E6E9]" />
                </div>

                {/* Social */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#DDE0E4] text-sm text-[#30343A] transition hover:bg-[#F7F7F8]"
                  >
                    <span className="font-semibold">G</span>
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#DDE0E4] text-sm text-[#30343A] transition hover:bg-[#F7F7F8]"
                  >
                    <span>◉</span>
                    GitHub
                  </button>
                </div>

                {/* Register */}
                <p className="mt-7 text-center text-sm text-[#777D85]">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-[#111214] underline underline-offset-4"
                  >
                    Create account
                  </Link>
                </p>

                {/* Protection */}
                <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-[#A0A5AC]">
                  <Shield size={14} strokeWidth={1.6} />

                  <span>Your career data is protected.</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* =================================================
            FOOTER
        ================================================== */}

        <footer className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-white/20 sm:left-10 sm:right-10 lg:left-14 lg:right-14 xl:left-20 xl:right-20">
          <span>Career Lens</span>

          <span className="hidden sm:block">For a better tomorrow</span>
        </footer>
      </div>
    </div>
  );
};

/* =========================================================
   FEATURE
========================================================= */

const Feature = ({ icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60">
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-medium text-white/65">{title}</p>

        <p className="mt-1 text-[10px] text-white/30">{subtitle}</p>
      </div>
    </div>
  );
};

export default Login;
