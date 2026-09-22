import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const HistoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/opportunity/history/${id}`);

      setAnalysis(response.data);
    } catch (err) {
      console.error(
        "Failed to load analysis:",
        err.response?.data || err.message,
      );

      setError(err.response?.data?.message || "Unable to load this analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadAnalysis();
    }
  }, [id]);

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return {
          container: "border-red-200 bg-red-50",
          icon: "bg-red-100 text-red-600",
          text: "text-red-700",
          progress: "bg-red-500",
        };

      case "Medium":
        return {
          container: "border-amber-200 bg-amber-50",
          icon: "bg-amber-100 text-amber-600",
          text: "text-amber-700",
          progress: "bg-amber-500",
        };

      default:
        return {
          container: "border-green-200 bg-green-50",
          icon: "bg-green-100 text-green-600",
          text: "text-green-700",
          progress: "bg-green-500",
        };
    }
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === "High") {
      return <ShieldAlert className="h-6 w-6" />;
    }

    if (riskLevel === "Medium") {
      return <TriangleAlert className="h-6 w-6" />;
    }

    return <ShieldCheck className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F1F3F5] px-4 py-8">
        <div className="flex items-center justify-center py-24">
          <div className="flex items-center gap-3 text-sm text-[#667085]">
            <Loader2 className="h-5 w-5 animate-spin text-[#6072D8]" />
            Loading analysis...
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F1F3F5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-[#6072D8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />

              <p>{error || "Analysis not found."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const riskStyles = getRiskStyles(analysis.riskLevel);

  return (
    <div className="min-h-screen bg-[#F1F3F5]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Back */}

        <button
          type="button"
          onClick={() => navigate("/history")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#667085] transition hover:text-[#6072D8]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </button>

        {/* Header */}

        <div className="mb-7">
          <p className="text-sm font-medium text-[#6072D8]">
            Opportunity Analysis
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#20252D] sm:text-3xl">
            {analysis.companyName || "Unknown company"}
          </h1>

          {analysis.contactEmail && (
            <p className="mt-2 text-sm text-[#667085]">
              {analysis.contactEmail}
            </p>
          )}
        </div>

        {/* Risk */}

        <div
          className={`mb-6 rounded-2xl border p-6 shadow-sm ${riskStyles.container}`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${riskStyles.icon}`}
              >
                {getRiskIcon(analysis.riskLevel)}
              </div>

              <div>
                <p className="text-sm text-[#667085]">Risk level</p>

                <h2 className={`text-2xl font-bold ${riskStyles.text}`}>
                  {analysis.riskLevel || "Unknown"} Risk
                </h2>

                <p className="text-sm text-[#667085]">{analysis.badge}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-[#667085]">Risk score</p>

              <p className={`text-3xl font-bold ${riskStyles.text}`}>
                {analysis.riskScore ?? 0}
                <span className="text-base font-medium">/100</span>
              </p>
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/70">
            <div
              className={`h-full rounded-full ${riskStyles.progress}`}
              style={{
                width: `${Math.min(analysis.riskScore || 0, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Submitted Content */}

        <section className="mb-6 rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
          <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
            <h2 className="font-semibold text-[#20252D]">
              Submitted opportunity
            </h2>
          </div>

          <div className="p-5 sm:p-6">
            <div className="whitespace-pre-wrap rounded-xl bg-[#F6F7F9] p-4 text-sm leading-7 text-[#667085]">
              {analysis.description}
            </div>
          </div>
        </section>

        {/* Red Flags */}

        <section className="mb-6 rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
          <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-red-500" />

              <h2 className="font-semibold text-[#20252D]">
                Detected warning signs
              </h2>
            </div>
          </div>

          {analysis.redFlags?.length > 0 ? (
            <div className="divide-y divide-[#E1E5EA]">
              {analysis.redFlags.map((flag) => (
                <div key={flag.id} className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[#20252D]">
                          {flag.title}
                        </h3>

                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                          +{flag.score} risk
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-[#667085]">
                        {flag.description}
                      </p>

                      {flag.matchedKeyword && (
                        <p className="mt-2 text-xs text-[#98A2B3]">
                          Detected signal:{" "}
                          <span className="font-medium text-[#667085]">
                            {flag.matchedKeyword}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />

              <p className="mt-3 text-sm font-medium text-[#20252D]">
                No common warning signs detected
              </p>
            </div>
          )}
        </section>

        {/* Recommendations */}

        <section className="mb-6 rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
          <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
            <h2 className="font-semibold text-[#20252D]">
              Recommended actions
            </h2>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            {(analysis.recommendations || []).map((recommendation, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl bg-[#F8F9FA] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6072D8]" />

                <p className="text-sm leading-6 text-[#667085]">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}

        <div className="rounded-xl border border-[#DDE1E6] bg-white p-4">
          <p className="text-xs leading-5 text-[#667085]">
            Career Lens identifies potential warning signs from the submitted
            information. It does not independently verify the identity of the
            company, recruiter or opportunity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
