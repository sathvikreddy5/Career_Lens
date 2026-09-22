import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Lightbulb,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

const Header = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  /*
   * ----------------------------------------------------
   * Page title
   * ----------------------------------------------------
   */

  const pageTitles = {
    "/dashboard": "Overview",
    "/job-ready": "Job Ready",
    "/practice": "Practice & Projects",
    "/career-profile": "Career Profile",
    "/career-readiness": "Career Readiness",
    "/opportunity-safety": "Opportunity Safety",
    "/history": "Safety History",
  };

  const pageTitle = pageTitles[location.pathname] || "CareerShield";

  /*
   * ----------------------------------------------------
   * Demo notifications
   *
   * These are local for now.
   * Later we can connect them to a notification table.
   * ----------------------------------------------------
   */

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "profile",
      title: "Complete your profile",
      description: "Add your target role to get better recommendations.",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      type: "practice",
      title: "New practice tasks available",
      description: "Continue building your practical skills.",
      time: "1d ago",
      unread: true,
    },
    {
      id: 3,
      type: "safety",
      title: "Stay safe online",
      description: "Check your latest opportunity safety alerts.",
      time: "2d ago",
      unread: true,
    },
    {
      id: 4,
      type: "career",
      title: "Career tip of the day",
      description: "Consistency beats intensity. Keep going.",
      time: "3d ago",
      unread: false,
    },
    {
      id: 5,
      type: "opportunity",
      title: "Explore opportunity safety",
      description: "Verify suspicious internships before responding.",
      time: "3d ago",
      unread: false,
    },
  ]);

  /*
   * ----------------------------------------------------
   * Close dropdowns when clicking outside
   * ----------------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * ----------------------------------------------------
   * Navigation
   * ----------------------------------------------------
   */

  const goTo = (path) => {
    navigate(path);
    setNotificationOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  /*
   * ----------------------------------------------------
   * Notifications
   * ----------------------------------------------------
   */

  const unreadCount = notifications.filter((item) => item.unread).length;

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id ? { ...item, unread: false } : item,
      ),
    );

    if (notification.type === "profile") {
      goTo("/career-profile");
    }

    if (notification.type === "practice") {
      goTo("/practice");
    }

    if (notification.type === "safety" || notification.type === "opportunity") {
      goTo("/opportunity-safety");
    }

    if (notification.type === "career") {
      goTo("/career-readiness");
    }
  };

  /*
   * ----------------------------------------------------
   * Notification icon
   * ----------------------------------------------------
   */

  const getNotificationIcon = (type) => {
    switch (type) {
      case "profile":
        return UserRound;

      case "practice":
        return Target;

      case "safety":
        return ShieldCheck;

      case "career":
        return Lightbulb;

      case "opportunity":
        return BriefcaseBusiness;

      default:
        return Bell;
    }
  };

  const getNotificationIconStyle = (type) => {
    switch (type) {
      case "profile":
        return "bg-[#EEF1FF] text-[#6072D8]";

      case "practice":
        return "bg-[#ECFDF3] text-[#12B76A]";

      case "safety":
        return "bg-[#FFF7E6] text-[#F59E0B]";

      case "career":
        return "bg-[#F4F0FF] text-[#7C5CFC]";

      case "opportunity":
        return "bg-[#FFF0F6] text-[#E64980]";

      default:
        return "bg-[#F2F4F7] text-[#667085]";
    }
  };

  /*
   * ----------------------------------------------------
   * Search
   * ----------------------------------------------------
   */

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const value = searchValue.trim().toLowerCase();

    if (!value) {
      return;
    }

    if (value.includes("profile") || value.includes("career profile")) {
      goTo("/career-profile");
      return;
    }

    if (value.includes("practice") || value.includes("project")) {
      goTo("/practice");
      return;
    }

    if (value.includes("ready") || value.includes("readiness")) {
      goTo("/career-readiness");
      return;
    }

    if (
      value.includes("safety") ||
      value.includes("fake") ||
      value.includes("scam") ||
      value.includes("internship")
    ) {
      goTo("/opportunity-safety");
      return;
    }

    if (value.includes("job")) {
      goTo("/job-ready");
      return;
    }
  };

  /*
   * ----------------------------------------------------
   * Logout
   * ----------------------------------------------------
   */

  const handleLogout = () => {
    setProfileOpen(false);

    if (typeof logout === "function") {
      logout();
    } else {
      localStorage.removeItem("careershield_token");
      localStorage.removeItem("careershield_user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:ml-[250px]">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#555] transition hover:bg-[#F3F4F6] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] text-[#9CA3AF]">Career Lens</p>

            <p className="truncate text-[13px] font-semibold text-[#20252D]">
              {pageTitle}
            </p>
          </div>
        </div>

        {/* =================================================
            CENTER SEARCH
        ================================================= */}

        <div
          ref={searchRef}
          className="relative mx-auto hidden max-w-[430px] flex-1 md:block"
        >
          <form onSubmit={handleSearchSubmit}>
            <div
              className={`flex h-10 items-center rounded-xl border bg-[#F8F9FB] transition ${
                searchOpen
                  ? "border-[#AEB8EE] bg-white shadow-sm"
                  : "border-[#E1E5EA]"
              }`}
            >
              <Search size={17} className="ml-3 shrink-0 text-[#98A2B3]" />

              <input
                type="text"
                value={searchValue}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search skills, practice, guides..."
                className="min-w-0 flex-1 bg-transparent px-3 text-xs text-[#20252D] outline-none placeholder:text-[#98A2B3]"
              />

              <span className="mr-2 hidden rounded-md border border-[#DDE1E6] bg-white px-2 py-1 text-[9px] font-medium text-[#98A2B3] lg:block">
                Ctrl K
              </span>
            </div>
          </form>

          {searchOpen && (
            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-[#E1E5EA] bg-white p-2 shadow-xl shadow-black/5">
              <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
                Quick navigation
              </p>

              <button
                type="button"
                onClick={() => goTo("/career-profile")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#F7F8FF]"
              >
                <UserRound size={16} className="text-[#6072D8]" />

                <div>
                  <p className="text-xs font-medium text-[#20252D]">
                    User Profile
                  </p>

                  <p className="text-[10px] text-[#98A2B3]">
                    Manage your career goals
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => goTo("/practice")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#F7F8FF]"
              >
                <Target size={16} className="text-[#12B76A]" />

                <div>
                  <p className="text-xs font-medium text-[#20252D]">
                    Practice & Projects
                  </p>

                  <p className="text-[10px] text-[#98A2B3]">
                    Build practical skills
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => goTo("/opportunity-safety")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#F7F8FF]"
              >
                <ShieldCheck size={16} className="text-[#F59E0B]" />

                <div>
                  <p className="text-xs font-medium text-[#20252D]">
                    Opportunity Safety
                  </p>

                  <p className="text-[10px] text-[#98A2B3]">
                    Check suspicious opportunities
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            AI STATUS CARD
        ================================================= */}

        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-careershield-ai"));
          }}
          className="hidden items-center gap-2 rounded-xl border border-[#E3E6FF] bg-[#F4F5FF] px-3 py-2 text-left transition hover:border-[#C8CEF9] hover:bg-[#EEF1FF] lg:flex"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#6072D8] shadow-sm">
            <Sparkles size={15} />
          </div>

          <div className="leading-none">
            <p className="text-[11px] font-semibold text-[#4F5FC7]">
              AI Assistant available
            </p>

            <p className="mt-1 text-[9px] text-[#7A8499]">
              Personalized career guidance
            </p>
          </div>
        </button>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          {/* Mobile search */}

          <button
            type="button"
            onClick={() => setSearchOpen((previous) => !previous)}
            className="rounded-lg p-2 text-[#555] transition hover:bg-[#F3F4F6] md:hidden"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((previous) => !previous);
                setProfileOpen(false);
              }}
              className="relative rounded-lg p-2 text-[#555] transition hover:bg-[#F3F4F6]"
              aria-label="Notifications"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <>
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-white bg-[#6072D8]" />

                  <span className="absolute -right-1 -top-2 hidden min-w-[16px] items-center justify-center rounded-full bg-[#6072D8] px-1 py-0.5 text-[8px] font-bold text-white sm:flex">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-[-72px] top-12 w-[calc(100vw-32px)] max-w-[390px] overflow-hidden rounded-2xl border border-[#E1E5EA] bg-white shadow-2xl shadow-black/10 sm:right-0">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#20252D]">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-[10px] text-[#98A2B3]">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${
                            unreadCount > 1 ? "s" : ""
                          }`
                        : "You're all caught up"}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[10px] font-medium text-[#6072D8] hover:text-[#5264CC]"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification list */}

                <div className="max-h-[390px] overflow-y-auto">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex w-full gap-3 border-b border-[#F0F2F5] px-4 py-3.5 text-left transition hover:bg-[#F8F9FF] ${
                          notification.unread ? "bg-[#FCFCFF]" : "bg-white"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getNotificationIconStyle(
                            notification.type,
                          )}`}
                        >
                          <Icon size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-[#20252D]">
                              {notification.title}
                            </p>

                            <span className="shrink-0 text-[9px] text-[#98A2B3]">
                              {notification.time}
                            </span>
                          </div>

                          <p className="mt-1 text-[10px] leading-4 text-[#667085]">
                            {notification.description}
                          </p>
                        </div>

                        {notification.unread && (
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6072D8]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}

                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => goTo("/opportunity-safety")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDE1E6] bg-[#F8F9FF] py-2.5 text-xs font-medium text-[#5264CC] transition hover:bg-[#EEF1FF]"
                  >
                    <ShieldCheck size={14} />
                    View safety checks
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-6 w-px bg-[#E5E7EB] sm:block" />

          {/* =================================================
              PROFILE
          ================================================= */}

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((previous) => !previous);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-[#F7F7F7]"
              aria-label="Open profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#20252D] text-sm font-medium text-white">
                {firstLetter}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[100px] truncate text-[13px] font-semibold text-[#20252D]">
                  {user?.name || "User"}
                </p>

                <p className="text-[10px] text-[#98A2B3]">Student</p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-[#888] transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-[270px] overflow-hidden rounded-2xl border border-[#E1E5EA] bg-white shadow-2xl shadow-black/10">
                {/* User */}

                <div className="border-b border-[#E5E7EB] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#20252D] text-base font-medium text-white">
                      {firstLetter}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#20252D]">
                        {user?.name || "User"}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#98A2B3]">
                        {user?.email || "Student account"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile */}

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => goTo("/career-profile")}
                    className="flex w-full items-center gap-3 rounded-xl bg-[#F4F5FF] px-3 py-3 text-left transition hover:bg-[#EEF1FF]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6072D8]">
                      <CircleUserRound size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#20252D]">
                        View Profile
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#667085]">
                        See and edit your User profile
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo("/career-profile")}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#F8F9FB]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#667085]">
                      <Target size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#20252D]">
                        User Profile
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#667085]">
                        Manage goals and preferences
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo("/career-readiness")}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#F8F9FB]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#667085]">
                      <CheckCircle2 size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#20252D]">
                        Skills check
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#667085]">
                        Review your skill assessment
                      </p>
                    </div>
                  </button>
                </div>

                {/* Logout */}

                <div className="border-t border-[#E5E7EB] p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[#D92D20] transition hover:bg-[#FFF1F0]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1F0]">
                      <LogOut size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold">Logout</p>

                      <p className="mt-0.5 text-[10px] text-[#98A2B3]">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH BAR
      ===================================================== */}

      {searchOpen && (
        <div className="border-t border-[#E5E7EB] bg-white px-4 py-3 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex h-10 items-center rounded-xl border border-[#DDE1E6] bg-[#F8F9FB]"
          >
            <Search size={17} className="ml-3 text-[#98A2B3]" />

            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search CareerShield..."
              className="min-w-0 flex-1 bg-transparent px-3 text-xs text-[#20252D] outline-none placeholder:text-[#98A2B3]"
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="mr-2 rounded-md p-1 text-[#98A2B3] hover:bg-[#EDEFF2]"
            >
              <X size={15} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
