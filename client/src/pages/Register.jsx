import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      await register(name.trim(), email.trim(), password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (registerError) {
      console.error("Registration failed:", registerError);

      setError(
        registerError?.response?.data?.message ||
          registerError?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3F5]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-2">
        {/* =====================================================
            LEFT BRAND PANEL
        ====================================================== */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#343A46] lg:flex">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-[330px] w-[330px] rounded-full border border-white/5" />

          <div className="pointer-events-none absolute -bottom-36 -left-32 h-[430px] w-[430px] rounded-full border border-white/5" />

          <div className="pointer-events-none absolute bottom-[-170px] right-[-100px] h-[350px] w-[350px] rounded-full bg-[#6072D8]/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#91A0F0]">
                  <ShieldCheck size={25} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-[17px] font-semibold tracking-tight text-white">
                    Career Lens
                  </p>

                  <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#AAB2C0]">
                    Career Readiness & Safety
                  </p>
                </div>
              </div>
            </div>

            {/* Main message */}
            <div className="max-w-[560px]">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#91A0F0]">
                Learn · Prepare · Verify · Stay Safe
              </p>

              <h1 className="text-[42px] font-bold leading-[1.08] tracking-[-0.035em] text-white xl:text-[52px]">
                Build skills.
                <br />
                <span className="text-[#91A0F0]">Find opportunities.</span>
                <br />
                Stay safe.
              </h1>

              <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-[#B8C0CC]">
                Career Lens helps you identify skill gaps, prepare for your
                target role, and verify career opportunities.
              </p>

              {/* Feature row */}
              <div className="mt-10 grid grid-cols-4 gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#91A0F0]">
                    <UserRound size={18} />
                  </div>

                  <p className="mt-3 text-[12px] font-semibold text-white">
                    Learn
                  </p>

                  <p className="mt-1 text-[10px] text-[#8993A3]">
                    Build skills
                  </p>
                </div>

                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#91A0F0]">
                    <CheckCircle2 size={18} />
                  </div>

                  <p className="mt-3 text-[12px] font-semibold text-white">
                    Prepare
                  </p>

                  <p className="mt-1 text-[10px] text-[#8993A3]">
                    Get job ready
                  </p>
                </div>

                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#91A0F0]">
                    <ShieldCheck size={18} />
                  </div>

                  <p className="mt-3 text-[12px] font-semibold text-white">
                    Verify
                  </p>

                  <p className="mt-1 text-[10px] text-[#8993A3]">
                    Check opportunities
                  </p>
                </div>

                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#91A0F0]">
                    <LockKeyhole size={18} />
                  </div>

                  <p className="mt-3 text-[12px] font-semibold text-white">
                    Stay Safe
                  </p>

                  <p className="mt-1 text-[10px] text-[#8993A3]">Avoid scams</p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="max-w-[500px]">
              <div className="mb-4 h-[2px] w-11 bg-[#91A0F0]" />

              <p className="text-[14px] italic leading-6 text-[#AEB6C3]">
                "Learn better. Prepare smarter. Stay informed."
              </p>

              <p className="mt-2 text-[10px] text-[#747E8E]">— Career Lens</p>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT REGISTER PANEL
        ====================================================== */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F1F3F5]" />

          <div className="relative z-10 w-full max-w-[480px]">
            {/* Mobile brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#6072D8]">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="text-[16px] font-semibold text-[#20252D]">
                  Career Lens
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#98A2B3]">
                  Career Readiness & Safety
                </p>
              </div>
            </div>

            {/* Header */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6072D8]">
                Get Started
              </p>

              <h2 className="mt-4 text-[32px] font-bold tracking-[-0.025em] text-[#20252D] sm:text-[36px]">
                Create your account
              </h2>

              <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                Start building a safer and stronger career journey.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-[12px] font-medium leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[13px] font-semibold text-[#20252D]"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-[52px] w-full rounded-xl border border-[#DDE1E6] bg-[#F8FAFC] pl-11 pr-4 text-[14px] text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:bg-white focus:ring-4 focus:ring-[#EEF1FF]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-semibold text-[#20252D]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-[52px] w-full rounded-xl border border-[#DDE1E6] bg-[#F8FAFC] pl-11 pr-4 text-[14px] text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:bg-white focus:ring-4 focus:ring-[#EEF1FF]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-semibold text-[#20252D]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-[52px] w-full rounded-xl border border-[#DDE1E6] bg-[#F8FAFC] pl-11 pr-12 text-[14px] text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:bg-white focus:ring-4 focus:ring-[#EEF1FF]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#98A2B3] transition hover:bg-[#EEF1FF] hover:text-[#6072D8]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[13px] font-semibold text-[#20252D]"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="h-[52px] w-full rounded-xl border border-[#DDE1E6] bg-[#F8FAFC] pl-11 pr-12 text-[14px] text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:bg-white focus:ring-4 focus:ring-[#EEF1FF]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#98A2B3] transition hover:bg-[#EEF1FF] hover:text-[#6072D8]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#6072D8] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#5264CC] focus:outline-none focus:ring-4 focus:ring-[#EEF1FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-7 text-center text-[13px] text-[#667085]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#6072D8] transition hover:text-[#5264CC]"
              >
                Sign in
              </Link>
            </p>

            {/* Bottom note */}
            <p className="mt-8 text-center text-[10px] leading-5 text-[#98A2B3]">
              By creating an account, you can build your career profile, assess
              your readiness, and explore safer opportunities.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
