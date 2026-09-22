import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ArrowRight, Mail, User } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");

      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");

      return;
    }

    if (!password) {
      setError("Please enter a password.");

      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");

      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    const result = await register(name, email, password);

    if (!result.success) {
      setError(result.message || "Unable to create account.");

      return;
    }

    setSuccess("Account created successfully. Redirecting...");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <AuthLayout>
      {/* HEADER */}

      <div className="mb-7">
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.12em]
            text-[#6072D8]
            mb-2
          "
        >
          Get started
        </p>

        <h2
          className="
            text-2xl
            sm:text-[30px]
            font-bold
            tracking-tight
            text-[#20252D]
          "
        >
          Create your account
        </h2>

        <p className="text-sm text-[#667085] mt-2">
          Start building a safer and stronger career journey.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mb-5
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          className="
            mb-5
            rounded-lg
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-sm
            text-emerald-600
          "
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}

        <div>
          <label
            htmlFor="name"
            className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            Full name
          </label>

          <div className="relative">
            <User
              size={17}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="
                w-full
                h-11
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-800
                placeholder:text-slate-400
                outline-none
                transition
                focus:bg-white
                focus:border-[#6072D8]
                focus:ring-2
                focus:ring-[#6072D8]/10
              "
            />
          </div>
        </div>

        {/* EMAIL */}

        <div>
          <label
            htmlFor="email"
            className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="
                w-full
                h-11
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-800
                placeholder:text-slate-400
                outline-none
                transition
                focus:bg-white
                focus:border-[#6072D8]
                focus:ring-2
                focus:ring-[#6072D8]/10
              "
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div>
          <label
            className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            Password
          </label>

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            id="password"
          />
        </div>

        {/* CONFIRM PASSWORD */}

        <div>
          <label
            className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
            "
          >
            Confirm password
          </label>

          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            id="confirmPassword"
          />
        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-11
            rounded-lg
            bg-[#6072D8]
            hover:bg-[#5264CC]
            text-white
            text-sm
            font-medium
            flex
            items-center
            justify-center
            gap-2
            transition
            shadow-sm
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <span
                className="
                  w-4
                  h-4
                  rounded-full
                  border-2
                  border-white/40
                  border-t-white
                  animate-spin
                "
              />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* LOGIN LINK */}

      <p
        className="
          text-center
          text-sm
          text-slate-500
          mt-7
        "
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="
            font-medium
            text-[#6072D8]
            hover:text-[#5264CC]
          "
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
