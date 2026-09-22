import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  id = "password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <LockKeyhole
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
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        className="
          w-full
          h-11
          rounded-lg
          border
          border-slate-200
          bg-slate-50
          pl-10
          pr-11
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

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute
          right-3.5
          top-1/2
          -translate-y-1/2
          text-slate-400
          hover:text-[#6072D8]
          transition
        "
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
};

export default PasswordInput;
