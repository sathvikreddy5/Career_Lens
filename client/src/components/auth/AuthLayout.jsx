import {
  ShieldCheck,
  BookOpen,
  ChartNoAxesCombined,
  BadgeCheck,
} from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F1F3F5] flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div
        className="
          w-full
          max-w-[1100px]
          min-h-[650px]
          bg-white
          rounded-2xl
          overflow-hidden
          border
          border-[#DDE1E6]
          shadow-[0_12px_40px_rgba(32,37,45,0.10)]
          flex
          flex-col
          lg:flex-row
        "
      >
        {/* ================= LEFT PANEL ================= */}

        <section
          className="
            relative
            lg:w-1/2
            bg-[#343A46]
            text-white
            overflow-hidden
          "
        >
          {/* Decorative circles */}

          <div
            className="
              absolute
              -top-32
              -right-32
              w-80
              h-80
              rounded-full
              border
              border-white/[0.04]
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-20
              w-96
              h-96
              rounded-full
              border
              border-white/[0.035]
            "
          />

          <div
            className="
              absolute
              bottom-[-100px]
              right-[-80px]
              w-72
              h-72
              rounded-full
              bg-[#6072D8]/[0.08]
            "
          />

          <div className="relative z-10 h-full flex flex-col p-7 sm:p-9 lg:p-11">
            {/* Brand */}

            <div className="flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-white/[0.08]
                  border
                  border-white/[0.12]
                  flex
                  items-center
                  justify-center
                "
              >
                <ShieldCheck
                  size={21}
                  strokeWidth={1.8}
                  className="text-[#91A0F0]"
                />
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Career Lens
                </h1>

                <p className="text-[10px] tracking-[0.16em] uppercase text-white/40 mt-0.5">
                  Career Intelligence
                </p>
              </div>
            </div>

            {/* Main Content */}

            <div className="mt-20 lg:mt-24 max-w-[500px]">
              <p
                className="
                  text-[#91A0F0]
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  tracking-[0.16em]
                  uppercase
                  mb-5
                "
              >
                Learn • Prepare • Verify • Stay Safe
              </p>

              <h2
                className="
                  text-[40px]
                  sm:text-[46px]
                  lg:text-[50px]
                  leading-[1.06]
                  font-bold
                  tracking-[-0.035em]
                  text-[#F8FAFC]
                "
              >
                Build your future.
                <span className="block text-[#91A0F0] mt-1.5">
                  Protect your journey.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  text-sm
                  sm:text-base
                  leading-6
                  text-white/55
                  max-w-[470px]
                "
              >
                Develop the right skills for your career, discover genuine
                opportunities, and stay protected from scams and digital
                threats.
              </p>
            </div>

            {/* Features */}

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-7">
              <Feature
                icon={<BookOpen size={18} />}
                title="Learn"
                text="Build skills"
              />

              <Feature
                icon={<ChartNoAxesCombined size={18} />}
                title="Prepare"
                text="Get job ready"
              />

              <Feature
                icon={<BadgeCheck size={18} />}
                title="Verify"
                text="Check opportunities"
              />

              <Feature
                icon={<ShieldCheck size={18} />}
                title="Stay Safe"
                text="Avoid scams"
              />
            </div>

            {/* Quote */}

            <div className="mt-auto pt-10">
              <div className="w-9 h-[2px] bg-[#91A0F0] mb-4" />

              <p className="text-xs sm:text-sm italic text-white/45">
                "Opportunities are everywhere. Make sure they're real."
              </p>

              <p className="text-[11px] text-white/25 mt-2">— Career Lens</p>
            </div>
          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}

        <section
          className="
            lg:w-1/2
            bg-white
            relative
          "
        >
          {/* Decorative shapes */}

          <div
            className="
              absolute
              -top-28
              -right-28
              w-64
              h-64
              rounded-full
              bg-[#F1F3F8]
            "
          />

          <div
            className="
              absolute
              -bottom-28
              -left-28
              w-64
              h-64
              rounded-full
              bg-[#F5F7FA]
            "
          />

          <div
            className="
              relative
              z-10
              min-h-full
              flex
              items-center
              justify-center
              px-6
              py-10
              sm:px-10
              lg:px-12
            "
          >
            <div className="w-full max-w-[400px]">
              {/* Mobile Brand */}

              <div className="flex lg:hidden items-center gap-3 mb-10">
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#EEF1FF]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck size={20} className="text-[#6072D8]" />
                </div>

                <div>
                  <p className="font-semibold text-[#20252D]">CareerShield</p>

                  <p className="text-[10px] text-[#98A0AA]">
                    Career Intelligence
                  </p>
                </div>
              </div>

              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, text }) => {
  return (
    <div>
      <div
        className="
          w-10
          h-10
          rounded-lg
          bg-[#414854]
          border
          border-white/[0.08]
          flex
          items-center
          justify-center
          text-[#91A0F0]
          mb-2.5
        "
      >
        {icon}
      </div>

      <p className="text-xs font-semibold text-white/80">{title}</p>

      <p className="text-[10px] text-white/35 mt-1">{text}</p>
    </div>
  );
};

export default AuthLayout;
