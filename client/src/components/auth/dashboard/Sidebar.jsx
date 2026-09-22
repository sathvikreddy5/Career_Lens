import {
  LayoutDashboard,
  Map,
  ClipboardCheck,
  ShieldCheck,
  History,
  UserRound,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout } = useAuth();

  const links = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Roadmap",
      path: "/job-ready",
      icon: Map,
    },
    {
      name: "Skill Check",
      path: "/career-readiness",
      icon: ClipboardCheck,
    },
    {
      name: "Verify Opportunity",
      path: "/opportunity-safety",
      icon: ShieldCheck,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "Profile",
      path: "/career-profile",
      icon: UserRound,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[250px]
          bg-[#111111] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                <GraduationCap size={19} strokeWidth={2} />
              </div>

              <div>
                <h1 className="text-[15px] font-semibold">Career Lens</h1>

                <p className="text-[11px] text-white/45">
                  Career Readiness & Safety
                </p>
              </div>
            </div>

            {/* Mobile Close */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-1.5 text-white/60 hover:bg-white/10 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Workspace
            </p>

            <div className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-3 rounded-lg px-3 py-2.5
                      text-[13px] transition-all
                      ${
                        isActive
                          ? "bg-white text-black font-medium"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }
                      `
                    }
                  >
                    <Icon size={17} strokeWidth={1.8} />

                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/60 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={17} strokeWidth={1.8} />

              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
