import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/opportunity/history");

      setHistory(response.data || []);
    } catch (err) {
      console.error(
        "Failed to load opportunity history:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your opportunity history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return {
          badge: "bg-red-50 text-red-600",
          icon: "bg-red-50 text-red-600",
        };

      case "Medium":
        return {
          badge: "bg-amber-50 text-amber-600",
          icon: "bg-amber-50 text-amber-600",
        };

      default:
        return {
          badge: "bg-green-50 text-green-600",
          icon: "bg-green-50 text-green-600",
        };
    }
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === "High") {
      return <ShieldAlert className="h-5 w-5" />;
    }

    if (riskLevel === "Medium") {
      return <TriangleAlert className="h-5 w-5" />;
    }

    return <ShieldCheck className="h-5 w-5" />;
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F3F5]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6072D8]">
            <Clock3 className="h-4 w-4" />
            History
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#20252D] sm:text-3xl">
            Your opportunity history
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
            Review the jobs, internships and offers you previously analyzed with
            Career Lens.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="rounded-2xl border border-[#DDE1E6] bg-white p-12 text-center shadow-sm">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#6072D8]" />

            <p className="mt-3 text-sm text-[#667085]">
              Loading your history...
            </p>
          </div>
        ) : history.length === 0 ? (
          /* Empty state */

          <div className="rounded-2xl border border-dashed border-[#C9CED6] bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1FF]">
              <FileSearch className="h-7 w-7 text-[#6072D8]" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#20252D]">
              No analyses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
              Analyze your first job or internship opportunity and it will
              appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/opportunity-safety")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6072D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC]"
            >
              Analyze an Opportunity
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* History */

          <div className="space-y-4">
            {history.map((item) => {
              const riskStyles = getRiskStyles(item.riskLevel);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/history/${item.id}`)}
                  className="group w-full rounded-2xl border border-[#DDE1E6] bg-white p-5 text-left shadow-sm transition hover:border-[#91A0F0] hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}

                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${riskStyles.icon}`}
                      >
                        {getRiskIcon(item.riskLevel)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate font-semibold text-[#20252D]">
                            {item.companyName || "Unknown company"}
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyles.badge}`}
                          >
                            {item.riskLevel || "Unknown"} Risk
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#667085]">
                          {item.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#98A2B3]">
                          <span>Analyzed {formatDate(item.createdAt)}</span>

                          {item.contactEmail && (
                            <span className="truncate">
                              {item.contactEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right */}

                    <div className="flex items-center justify-between gap-6 border-t border-[#E1E5EA] pt-4 lg:border-t-0 lg:pt-0">
                      <div>
                        <p className="text-xs text-[#98A2B3]">Risk score</p>

                        <p className="mt-1 text-xl font-bold text-[#20252D]">
                          {item.riskScore ?? 0}
                          <span className="text-sm font-medium text-[#98A2B3]">
                            /100
                          </span>
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 text-[#98A2B3] transition group-hover:translate-x-1 group-hover:text-[#6072D8]" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom note */}

        {!loading && history.length > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#DDE1E6] bg-white p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6072D8]" />

            <p className="text-xs leading-5 text-[#667085]">
              Your analyses are linked to your Career Lens account so you can
              review them later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
