const SIGNALS = [
  {
    id: "fee_request",
    weight: 60,
    title: "Payment request detected",
    description:
      "The opportunity appears to request payment from candidates to obtain or confirm the opportunity.",
    check: (p) => {
      const text = p.description || "";

      const explicitFeeTerms =
        /registration\s+fee|application\s+fee|processing\s+fee|security\s+deposit|training\s+(fee|kit|charge)|internship\s+(fee|charge|payment)|joining\s+(fee|charge|payment)/i;

      const paymentAction = /pay|payment|charge|fee|deposit|cost|price|amount/i;

      const moneyAmount =
        /₹\s*\d+|rs\.?\s*\d+|\b\d+\s*(rupees|rs)\b|\b\d{2,6}\b/i;

      const opportunitySlot =
        /(internship|job|position|slot|slots|registration|selection|joining)/i;

      return (
        explicitFeeTerms.test(text) ||
        (paymentAction.test(text) &&
          moneyAmount.test(text) &&
          opportunitySlot.test(text))
      );
    },
  },
  {
    id: "ml_fraud_prob",

    weight: 25,

    title: "ML fraud risk signal",

    description:
      "The machine-learning model identified characteristics associated with fraudulent opportunity postings.",

    check: (p) =>
      Number.isFinite(Number(p.mlFraudProbability)) &&
      Number(p.mlFraudProbability) >= 0.75,
  },

  {
    id: "free_email",
    weight: 20,
    title: "Free email address",
    description:
      "The contact address uses a public email provider rather than a company email domain.",
    check: (p) =>
      /@(gmail|yahoo|outlook|hotmail|rediffmail)\./i.test(p.contactEmail || ""),
  },

  {
    id: "no_domain_match",
    weight: 25,
    title: "Email and company domains do not match",
    description:
      "The recruiter's email domain does not match the stated company domain.",
    check: (p) =>
      p.contactDomain &&
      p.companyDomain &&
      p.contactDomain.toLowerCase() !== p.companyDomain.toLowerCase(),
  },

  {
    id: "duplicate_jd",
    weight: 30,
    title: "Similar job descriptions detected",
    description:
      "A highly similar opportunity description appears across multiple postings.",
    check: (p) => Number(p.duplicateClusterSize || 0) > 5,
  },

  {
    id: "young_domain",
    weight: 15,
    title: "Recently registered domain",
    description:
      "The associated website domain appears to have been registered recently.",
    check: (p) =>
      p.domainAgeDays !== null &&
      p.domainAgeDays !== undefined &&
      p.domainAgeDays !== "" &&
      Number.isFinite(Number(p.domainAgeDays)) &&
      Number(p.domainAgeDays) < 90,
  },

  {
    id: "urgency_lang",
    weight: 10,
    title: "Urgency language detected",
    description:
      "The opportunity uses urgency-focused language such as immediate joining, limited seats, or hurry.",
    check: (p) =>
      /immediate\s+joining|limited\s+seats|hurry|only\s+\d+\s+(spots|positions|openings)|apply\s+immediately/i.test(
        p.description || "",
      ),
  },

  {
    id: "whatsapp_only",
    weight: 20,
    title: "WhatsApp-only contact",
    description:
      "The opportunity appears to rely on a phone or WhatsApp contact without providing a professional email address.",
    check: (p) =>
      !p.contactEmail && /(?:\+91[\s-]?)?[6-9]\d{9}/.test(p.description || ""),
  },

  {
    id: "no_interview",
    weight: 20,
    title: "No-interview claim",
    description:
      "The opportunity suggests that candidates can be selected without an interview or normal screening process.",
    check: (p) =>
      /no\s+interview|without\s+interview|direct\s+selection|guaranteed\s+selection|selected\s+without/i.test(
        p.description || "",
      ),
  },

  {
    id: "community_flags",
    weight: 25,
    title: "Community reports detected",
    description:
      "Multiple weighted community reports have been associated with this opportunity.",
    check: (p) => Number(p.weightedReports || 0) >= 3,
  },
];

/*
 * Positive signals reduce the calculated risk.
 */
const POSITIVE = [
  {
    id: "verified_domain",
    weight: -25,
    title: "Verified company domain",
    description:
      "The recruiter's email domain has been verified against the company domain.",
    check: (p) => p.emailVerifiedAgainstDomain === true,
  },

  {
    id: "cin_verified",
    weight: -20,
    title: "Company registration verified",
    description: "The company registration information could be verified.",
    check: (p) => p.cinVerified === true,
  },

  {
    id: "on_career_page",
    weight: -20,
    title: "Found on official careers page",
    description:
      "A matching opportunity was found on the company's official careers page.",
    check: (p) => p.foundOnOfficialCareersPage === true,
  },
];

export const scorePosting = (posting = {}) => {
  const allSignals = [...SIGNALS, ...POSITIVE];

  const fired = allSignals.filter((signal) => signal.check(posting));

  const rawScore = fired.reduce((sum, signal) => sum + signal.weight, 0);

  /*
   * Risk is always between 0 and 100.
   */
  const riskScore = Math.max(0, Math.min(100, rawScore));

  let badge;

  if (riskScore >= 60) {
    badge = "HIGH_RISK";
  } else if (riskScore >= 30) {
    badge = "CAUTION";
  } else {
    badge = "VERIFIED";
  }

  const reasons = fired
    .filter((signal) => signal.weight > 0)
    .map((signal) => ({
      id: signal.id,
      title: signal.title,
      description: signal.description,
      weight: signal.weight,
    }));

  const positiveSignals = fired
    .filter((signal) => signal.weight < 0)
    .map((signal) => ({
      id: signal.id,
      title: signal.title,
      description: signal.description,
      weight: signal.weight,
    }));

  return {
    riskScore,
    badge,
    reasons,
    positiveSignals,
    computedAt: new Date(),
  };
};
