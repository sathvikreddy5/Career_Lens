import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import api from "../../../services/api";
import AIButton from "./AIButton";
import AIChatWindow from "./AIChatWindow";

const AIAssistant = () => {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [careerData, setCareerData] = useState({
    targetRole: "",
    skillGaps: [],
    practiceProgress: "",
  });

  useEffect(() => {
    const handleOpenAI = () => {
      setOpen(true);
    };

    window.addEventListener("open-careershield-ai", handleOpenAI);

    return () => {
      window.removeEventListener("open-careershield-ai", handleOpenAI);
    };
  }, []);

  /*
   * Identify the current CareerShield page.
   */
  const page = useMemo(() => {
    const pathname = location.pathname;

    if (pathname === "/dashboard") {
      return "dashboard";
    }

    if (pathname.includes("career-readiness")) {
      return "career-readiness";
    }

    if (pathname.includes("job-ready")) {
      return "job-ready";
    }

    if (pathname.includes("practice")) {
      return "practice";
    }

    if (pathname.includes("/learn/")) {
      return "learn-skill";
    }

    if (pathname.includes("opportunity-safety")) {
      return "opportunity-safety";
    }

    if (pathname.includes("history")) {
      return "history";
    }

    return pathname;
  }, [location.pathname]);

  /*
   * Load CareerShield data for the AI.
   */
  useEffect(() => {
    const loadCareerContext = async () => {
      try {
        const [profileResponse, readinessResponse, practiceResponse] =
          await Promise.all([
            api.get("/profile"),
            api.get("/career/readiness"),
            api.get("/practice/summary"),
          ]);

        const profile =
          profileResponse.data?.profile || profileResponse.data || {};
        const readiness = readinessResponse.data || {};
        const practice = practiceResponse.data || {};

        /*
         * Target role
         */
        const targetRole = profile.targetRole || readiness.targetRole || "";

        /*
         * Skill gaps
         *
         * The readiness API already calculates the student's
         * missing/developing skills.
         */
        const skillGaps = Array.isArray(readiness.skillGaps)
          ? readiness.skillGaps.map(
              (skill) => skill.skillName || skill.skillId || skill,
            )
          : [];

        /*
         * Practice progress
         */
        const practiceSummary = Array.isArray(practice.summary)
          ? practice.summary
          : [];

        const completedTasks = practiceSummary.reduce(
          (total, item) => total + (Number(item.completedTasks) || 0),
          0,
        );

        const practiceProgress =
          completedTasks > 0
            ? `${completedTasks} practice task${
                completedTasks === 1 ? "" : "s"
              } completed`
            : "No practice tasks completed yet.";

        setCareerData({
          targetRole,
          skillGaps,
          practiceProgress,
        });
      } catch (error) {
        console.error("Failed to load CareerShield AI context:", error);
      }
    };

    loadCareerContext();
  }, [location.pathname]);

  /*
   * Send message to CareerShield AI.
   */
  const sendMessage = async () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    setMessages((previous) => [...previous, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: trimmedMessage,

        context: {
          page,

          targetRole: careerData.targetRole || "Not provided",

          skillGaps: careerData.skillGaps || [],

          practiceProgress: careerData.practiceProgress || "Not provided",

          additionalContext: `Current CareerShield route: ${location.pathname}`,
        },
      });

      const aiResponse =
        response.data?.response || "I couldn't generate a response right now.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("Career Les AI error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Unable to connect to Career Lens AI right now.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <AIChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          loading={loading}
        />
      )}

      <AIButton open={open} onClick={() => setOpen((previous) => !previous)} />
    </>
  );
};

export default AIAssistant;
