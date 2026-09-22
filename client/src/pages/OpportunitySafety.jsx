import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Image,
  X,
  ExternalLink,
  FileSearch,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import api from "../services/api";

const OpportunitySafety = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    description: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image size must be less than 8 MB.");
      return;
    }

    setError("");
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");
    setAnalysis(null);

    if (!form.description.trim() && !selectedImage) {
      setError(
        "Please paste the opportunity details or upload a screenshot before analyzing.",
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("companyName", form.companyName);
      formData.append("contactEmail", form.contactEmail);
      formData.append("description", form.description);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await api.post("/opportunity/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(response.data);
    } catch (err) {
      console.error(
        "Opportunity analysis error:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message ||
          "Unable to analyze this opportunity. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({
      companyName: "",
      contactEmail: "",
      description: "",
    });

    setSelectedImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setAnalysis(null);
    setError("");
  };

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return {
          container: "border-red-200 bg-red-50",
          icon: "bg-red-100 text-red-600",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
          progress: "bg-red-500",
        };

      case "Medium":
        return {
          container: "border-amber-200 bg-amber-50",
          icon: "bg-amber-100 text-amber-600",
          text: "text-amber-700",
          badge: "bg-amber-100 text-amber-700",
          progress: "bg-amber-500",
        };

      default:
        return {
          container: "border-green-200 bg-green-50",
          icon: "bg-green-100 text-green-600",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
          progress: "bg-green-500",
        };
    }
  };

  const riskStyles = analysis ? getRiskStyles(analysis.riskLevel) : null;

  return (
    <div className="min-h-screen bg-[#F1F3F5]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============================================================ */}
        {/* Header */}
        {/* ============================================================ */}

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6072D8]">
            <ShieldCheck className="h-4 w-4" />
            Opportunity Safety
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#20252D] sm:text-3xl">
            Check an opportunity before you trust it
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085] sm:text-base">
            Paste a job, internship, or offer message and Career Lens will look
            for common warning signs and explain what you should verify.
          </p>
        </div>

        {/* ============================================================ */}
        {/* Error */}
        {/* ============================================================ */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* ========================================================== */}
          {/* Input Card */}
          {/* ========================================================== */}

          <section className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
            <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF]">
                  <FileSearch className="h-5 w-5 text-[#6072D8]" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#20252D]">
                    Analyze opportunity
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-[#667085]">
                    Provide whatever information you have. More context can help
                    identify more warning signs.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-5 p-5 sm:p-6">
              {/* Company */}

              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-medium text-[#20252D]"
                >
                  Company name
                  <span className="ml-1 font-normal text-[#98A2B3]">
                    (optional)
                  </span>
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Example: ABC Technologies"
                  className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="contactEmail"
                  className="mb-2 block text-sm font-medium text-[#20252D]"
                >
                  Recruiter / contact email
                  <span className="ml-1 font-normal text-[#98A2B3]">
                    (optional)
                  </span>
                </label>

                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="recruiter@company.com"
                  className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
                />
              </div>
              {/* Image Upload */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-[#20252D]">
                    Upload screenshot
                    <span className="ml-1 font-normal text-[#98A2B3]">
                      (optional)
                    </span>
                  </label>

                  <span className="text-xs text-[#98A2B3]">
                    JPG, PNG, WEBP · Max 8 MB
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {!selectedImage ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#C9CED6] bg-[#F8F9FA] px-6 py-8 text-center transition hover:border-[#6072D8] hover:bg-[#F4F5FF]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF1FF]">
                      <Image className="h-6 w-6 text-[#6072D8]" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#20252D]">
                      Upload a screenshot
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      Job messages, offer letters, recruiter chats or internship
                      advertisements
                    </p>
                  </button>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-[#DDE1E6] bg-[#F8F9FA]">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded opportunity screenshot"
                        className="max-h-72 w-full object-contain bg-white"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#667085] shadow-sm transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 border-t border-[#E1E5EA] px-4 py-3">
                      <Image className="h-4 w-4 text-[#6072D8]" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#20252D]">
                          {selectedImage.name}
                        </p>

                        <p className="text-xs text-[#98A2B3]">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-2 text-xs leading-5 text-[#98A2B3]">
                  Career Lens will extract visible text from the image and check
                  it for common opportunity safety warning signs.
                </p>
              </div>

              {/* Description */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#20252D]"
                  >
                    Opportunity details
                    <span className="ml-1 font-normal text-[#98A2B3]">
                      (optional if uploading a screenshot)
                    </span>
                  </label>

                  <span className="text-xs text-[#98A2B3]">Required</span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={12}
                  placeholder={`Paste the job or internship message here...

Example:
Congratulations! You have been selected for our internship program.

To confirm your position, please pay a refundable registration fee of ₹2,000 within 24 hours.

Contact our HR team on WhatsApp for further instructions.`}
                  className="w-full resize-y rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm leading-6 text-[#20252D] outline-none transition placeholder:text-[#98A2B3] focus:border-[#6072D8] focus:ring-2 focus:ring-[#6072D8]/10"
                />

                <p className="mt-2 text-xs leading-5 text-[#98A2B3]">
                  Do not include passwords, OTPs, banking credentials, or other
                  private information.
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="rounded-xl border border-[#DDE1E6] bg-white px-5 py-3 text-sm font-semibold text-[#667085] transition hover:bg-[#F6F7F9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6072D8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5264CC] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Opportunity
                      <FileSearch className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ========================================================== */}
          {/* Initial Information / Result */}
          {/* ========================================================== */}

          {!analysis ? (
            <section className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
              <div className="p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF1FF]">
                  <ShieldCheck className="h-6 w-6 text-[#6072D8]" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#20252D]">
                  What Career Lens checks
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  The safety analyzer checks the submitted opportunity for
                  common warning signs.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Payment requests",
                      description:
                        "Registration, processing, training or security fees.",
                    },
                    {
                      title: "Sensitive information",
                      description:
                        "Requests for passwords, OTPs or financial details.",
                    },
                    {
                      title: "Unusual urgency",
                      description:
                        "Pressure to act immediately or within a short deadline.",
                    },
                    {
                      title: "Unrealistic guarantees",
                      description:
                        "Claims of guaranteed jobs, placements or internships.",
                    },
                    {
                      title: "Suspicious communication",
                      description:
                        "Unusual contact methods or potentially indirect links.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F6F7F9]">
                        <ShieldAlert className="h-4 w-4 text-[#6072D8]" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#20252D]">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-xl border border-[#DDE1E6] bg-[#F8F9FA] p-4">
                  <p className="text-xs leading-5 text-[#667085]">
                    <span className="font-semibold text-[#20252D]">
                      Important:
                    </span>{" "}
                    A low risk score does not prove that an opportunity is
                    legitimate. Always verify important details independently.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-5">
              {/* ======================================================== */}
              {/* Risk Summary */}
              {/* ======================================================== */}

              <div
                className={`rounded-2xl border p-6 shadow-sm ${riskStyles.container}`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${riskStyles.icon}`}
                    >
                      {analysis.riskLevel === "High" ? (
                        <ShieldAlert className="h-6 w-6" />
                      ) : analysis.riskLevel === "Medium" ? (
                        <TriangleAlert className="h-6 w-6" />
                      ) : (
                        <ShieldCheck className="h-6 w-6" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#667085]">
                        Safety analysis
                      </p>

                      <h2
                        className={`mt-1 text-2xl font-bold ${riskStyles.text}`}
                      >
                        {analysis.riskLevel} Risk
                      </h2>

                      <p className="mt-1 text-sm text-[#667085]">
                        {analysis.badge}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#667085]">Risk score</p>

                    <p className={`mt-1 text-3xl font-bold ${riskStyles.text}`}>
                      {analysis.riskScore}
                      <span className="text-base font-medium">/100</span>
                    </p>
                  </div>
                </div>

                {/* Score bar */}

                <div className="mt-6">
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/70">
                    <div
                      className={`h-full rounded-full ${riskStyles.progress}`}
                      style={{
                        width: `${Math.min(analysis.riskScore || 0, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {analysis.source === "image" && analysis.extractedText && (
                <div className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
                  <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <Image className="h-5 w-5 text-[#6072D8]" />

                      <h2 className="font-semibold text-[#20252D]">
                        Text extracted from image
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-[#667085]">
                      This is the text Career Lens used for the safety analysis.
                    </p>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="max-h-64 overflow-y-auto rounded-xl bg-[#F8F9FA] p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-[#667085]">
                        {analysis.extractedText}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* Red Flags */}
              {/* ======================================================== */}

              <div className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
                <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />

                    <h2 className="font-semibold text-[#20252D]">
                      Detected warning signs
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-[#667085]">
                    These are the signals detected in the submitted content.
                  </p>
                </div>

                {analysis.redFlags?.length > 0 ? (
                  <div className="divide-y divide-[#E1E5EA]">
                    {analysis.redFlags.map((flag) => (
                      <div key={flag.id} className="p-5 sm:p-6">
                        <div className="flex gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                            <TriangleAlert className="h-4 w-4 text-red-500" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-[#20252D]">
                                {flag.title}
                              </h3>

                              <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
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

                    <p className="mt-1 text-xs text-[#667085]">
                      This does not guarantee that the opportunity is
                      legitimate.
                    </p>
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* Recommendations */}
              {/* ======================================================== */}

              <div className="rounded-2xl border border-[#DDE1E6] bg-white shadow-sm">
                <div className="border-b border-[#E1E5EA] p-5 sm:p-6">
                  <h2 className="font-semibold text-[#20252D]">
                    What you should do
                  </h2>

                  <p className="mt-1 text-sm text-[#667085]">
                    Recommended safety actions based on the detected signals.
                  </p>
                </div>

                <div className="space-y-3 p-5 sm:p-6">
                  {(analysis.recommendations || []).map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-[#F8F9FA] p-4"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6072D8]" />

                        <p className="text-sm leading-6 text-[#667085]">
                          {recommendation}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* ======================================================== */}
              {/* Disclaimer */}
              {/* ======================================================== */}

              <div className="rounded-2xl border border-[#DDE1E6] bg-white p-5 shadow-sm">
                <p className="text-xs leading-5 text-[#667085]">
                  <span className="font-semibold text-[#20252D]">
                    Safety note:
                  </span>{" "}
                  Career Lens identifies potential warning signs from the
                  information provided. It does not independently verify the
                  identity of a company, recruiter or opportunity.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunitySafety;
