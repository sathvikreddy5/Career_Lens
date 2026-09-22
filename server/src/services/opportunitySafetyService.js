const suspiciousPatterns = [
  {
    id: "payment-request",
    keywords: [
      "pay registration fee",
      "registration fee",
      "pay fee",
      "processing fee",
      "security deposit",
      "refundable deposit",
      "pay to apply",
      "payment required",
      "application fee",
      "joining fee",
      "placement fee",
      "job fee",
    ],
    score: 30,
    title: "Payment requested",
    description:
      "The opportunity appears to ask the applicant to make a payment before or during the hiring process.",
    severity: "high",
  },

  {
    id: "financial-information",
    keywords: [
      "bank account",
      "bank details",
      "account number",
      "ifsc",
      "upi",
      "credit card",
      "debit card",
      "card number",
    ],
    score: 25,
    title: "Sensitive financial information requested",
    description:
      "The opportunity appears to request bank, card, UPI or other financial information.",
    severity: "high",
  },

  {
    id: "urgent-language",
    keywords: [
      "act immediately",
      "urgent",
      "limited time",
      "respond immediately",
      "within 24 hours",
      "offer expires",
      "last chance",
      "immediately",
    ],
    score: 10,
    title: "Urgency pressure",
    description:
      "The message uses urgency or time pressure that may encourage the applicant to act before verifying the opportunity.",
    severity: "medium",
  },

  {
    id: "guaranteed-job",
    keywords: [
      "guaranteed job",
      "100% placement",
      "guaranteed placement",
      "job guaranteed",
      "guaranteed internship",
      "guaranteed salary",
      "job assured",
      "placement assured",
    ],
    score: 25,
    title: "Guaranteed employment claim",
    description:
      "The opportunity makes a strong employment or placement guarantee that should be independently verified.",
    severity: "high",
  },

  {
    id: "password-request",
    keywords: [
      "password",
      "otp",
      "one time password",
      "login credentials",
      "account credentials",
      "verification code",
    ],
    score: 35,
    title: "Account credentials requested",
    description:
      "The message appears to request passwords, OTPs, verification codes or account credentials.",
    severity: "critical",
  },

  {
    id: "unofficial-contact",
    keywords: [
      "telegram",
      "whatsapp only",
      "contact me on whatsapp",
      "contact me on telegram",
      "message me on whatsapp",
      "message me on telegram",
    ],
    score: 10,
    title: "Unofficial communication channel",
    description:
      "The opportunity relies on an informal communication channel instead of providing a clearly verifiable professional contact.",
    severity: "medium",
  },

  {
    id: "training-fee",
    keywords: [
      "training fee",
      "course fee",
      "certification fee",
      "training charges",
      "learning fee",
      "pay for training",
      "paid training",
    ],
    score: 25,
    title: "Training or certification payment",
    description:
      "The opportunity appears to require payment for training or certification as part of the opportunity.",
    severity: "high",
  },

  {
    id: "crypto-request",
    keywords: [
      "crypto",
      "cryptocurrency",
      "bitcoin",
      "usdt",
      "wallet address",
      "crypto payment",
    ],
    score: 35,
    title: "Cryptocurrency-related request",
    description:
      "The opportunity contains cryptocurrency or wallet-related payment language that requires additional verification.",
    severity: "critical",
  },
];

const normalizeText = (text = "") =>
  String(text).toLowerCase().replace(/\s+/g, " ").trim();

const containsKeyword = (text, keyword) =>
  text.includes(normalizeText(keyword));

const extractUrls = (text = "") =>
  String(text).match(/https?:\/\/[^\s]+/gi) || [];

const getRiskLevel = (riskScore) => {
  if (riskScore >= 70) {
    return "High";
  }

  if (riskScore >= 40) {
    return "Medium";
  }

  return "Low";
};

const getBadge = (riskLevel) => {
  if (riskLevel === "High") {
    return "High risk";
  }

  if (riskLevel === "Medium") {
    return "Needs verification";
  }

  return "No major warning signs detected";
};

const addFlag = (redFlags, pattern, matchedKeyword) => {
  redFlags.push({
    id: pattern.id,
    title: pattern.title,
    description: pattern.description,
    matchedKeyword,
    score: pattern.score,
    severity: pattern.severity,
  });
};

export const analyzeOpportunity = ({
  companyName = "",
  contactEmail = "",
  description = "",
}) => {
  const normalizedCompany = normalizeText(companyName);
  const normalizedEmail = normalizeText(contactEmail);
  const normalizedDescription = normalizeText(description);

  const combinedText = normalizeText(
    `${companyName} ${contactEmail} ${description}`,
  );

  const redFlags = [];
  let riskScore = 0;

  // ------------------------------------------------------------
  // 1. Suspicious keyword checks
  // ------------------------------------------------------------

  for (const pattern of suspiciousPatterns) {
    const matchedKeyword = pattern.keywords.find((keyword) =>
      containsKeyword(combinedText, keyword),
    );

    if (matchedKeyword) {
      riskScore += pattern.score;

      addFlag(redFlags, pattern, matchedKeyword);
    }
  }

  // ------------------------------------------------------------
  // 2. Personal email check
  // ------------------------------------------------------------

  if (normalizedEmail) {
    const personalProviders = [
      "@gmail.com",
      "@yahoo.com",
      "@outlook.com",
      "@hotmail.com",
      "@proton.me",
      "@protonmail.com",
    ];

    const isPersonalEmail = personalProviders.some((provider) =>
      normalizedEmail.endsWith(provider),
    );

    if (isPersonalEmail) {
      riskScore += 10;

      redFlags.push({
        id: "personal-email",
        title: "Personal email address",
        description:
          "The contact uses a common personal email provider instead of a company domain. This does not prove fraud, but the employer should be independently verified.",
        matchedKeyword: contactEmail,
        score: 10,
        severity: "medium",
      });
    }
  }

  // ------------------------------------------------------------
  // 3. Suspicious URL check
  // ------------------------------------------------------------

  const urls = extractUrls(description);

  const suspiciousUrl = urls.find((url) => {
    const normalizedUrl = url.toLowerCase();

    return (
      normalizedUrl.includes("bit.ly") ||
      normalizedUrl.includes("tinyurl.com") ||
      normalizedUrl.includes("t.co/") ||
      normalizedUrl.includes("forms.gle")
    );
  });

  if (suspiciousUrl) {
    riskScore += 15;

    redFlags.push({
      id: "shortened-link",
      title: "Unverified or shortened link",
      description:
        "The opportunity contains a shortened or indirect link. Verify the destination and organization before opening or submitting information.",
      matchedKeyword: suspiciousUrl,
      score: 15,
      severity: "medium",
    });
  }

  // ------------------------------------------------------------
  // 4. Ambiguous payment language
  // ------------------------------------------------------------

  const paymentWords = [
    "internship pay",
    "salary",
    "stipend",
    "pay 999",
    "pay ₹",
    "pay rs",
    "pay inr",
  ];

  const hasPaymentAmount = paymentWords.some((keyword) =>
    normalizedDescription.includes(keyword),
  );

  const hasClearPaymentRequest = redFlags.some(
    (flag) => flag.id === "payment-request" || flag.id === "training-fee",
  );

  /*
   * "Internship pay 999" by itself does NOT prove that the
   * applicant is being asked to pay money.
   *
   * Therefore we only create an informational flag instead
   * of treating it as a scam signal.
   */
  if (hasPaymentAmount && !hasClearPaymentRequest) {
    redFlags.push({
      id: "payment-ambiguity",
      title: "Payment information needs clarification",
      description:
        "The opportunity mentions a payment amount, but the submitted text does not clearly indicate whether this is a stipend paid to the applicant or a fee requested from the applicant.",
      matchedKeyword: "payment amount",
      score: 0,
      severity: "info",
    });
  }

  // ------------------------------------------------------------
  // 5. Missing company information
  // ------------------------------------------------------------

  if (!normalizedCompany) {
    redFlags.push({
      id: "missing-company",
      title: "Company name not provided",
      description:
        "The submission does not include a company name, making independent verification more difficult.",
      matchedKeyword: null,
      score: 5,
      severity: "medium",
    });

    riskScore += 5;
  }

  // ------------------------------------------------------------
  // 6. Very limited opportunity information
  // ------------------------------------------------------------

  const words = normalizedDescription.split(/\s+/).filter(Boolean);

  if (words.length > 0 && words.length < 10) {
    redFlags.push({
      id: "limited-information",
      title: "Limited opportunity information",
      description:
        "The submitted opportunity contains very little information, so the employer, role and hiring conditions cannot be fully verified from the provided text.",
      matchedKeyword: null,
      score: 5,
      severity: "medium",
    });

    riskScore += 5;
  }

  // ------------------------------------------------------------
  // 7. Cap score
  // ------------------------------------------------------------

  riskScore = Math.min(riskScore, 100);

  // ------------------------------------------------------------
  // 8. Risk level
  // ------------------------------------------------------------

  const riskLevel = getRiskLevel(riskScore);
  const badge = getBadge(riskLevel);

  // ------------------------------------------------------------
  // 9. Recommendations
  // ------------------------------------------------------------

  const recommendations = [];

  if (riskScore >= 70) {
    recommendations.push(
      "Do not send money or sensitive personal information until the opportunity is independently verified.",
    );

    recommendations.push(
      "Verify the company and recruiter through the organization's official website or verified careers page.",
    );
  } else if (riskScore >= 40) {
    recommendations.push(
      "Verify the recruiter, company domain and opportunity details before proceeding.",
    );

    recommendations.push(
      "Avoid sharing sensitive information until the employer and opportunity are independently verified.",
    );
  } else {
    recommendations.push(
      "No major warning pattern was detected, but independently verify the employer and opportunity before proceeding.",
    );
  }

  if (redFlags.some((flag) => flag.id === "password-request")) {
    recommendations.push(
      "Never share passwords, OTPs, verification codes or account credentials with recruiters.",
    );
  }

  if (
    redFlags.some(
      (flag) => flag.id === "payment-request" || flag.id === "training-fee",
    )
  ) {
    recommendations.push(
      "Do not pay application, registration, training or security fees without independent verification.",
    );
  }

  if (redFlags.some((flag) => flag.id === "financial-information")) {
    recommendations.push(
      "Do not share bank, card, UPI or other financial information before verifying the employer.",
    );
  }

  if (redFlags.some((flag) => flag.id === "personal-email")) {
    recommendations.push(
      "Check whether the recruiter can be verified through an official company domain or company website.",
    );
  }

  if (redFlags.some((flag) => flag.id === "shortened-link")) {
    recommendations.push(
      "Verify shortened or indirect links before opening them or entering personal information.",
    );
  }

  if (redFlags.some((flag) => flag.id === "payment-ambiguity")) {
    recommendations.push(
      "Clarify whether the stated amount is a stipend paid to you or a fee that you are expected to pay.",
    );
  }

  // ------------------------------------------------------------
  // 10. Evidence / explanation report
  // ------------------------------------------------------------

  const detectedSignals = redFlags.filter((flag) => flag.score > 0);

  const informationalSignals = redFlags.filter((flag) => flag.score === 0);

  const summary =
    riskLevel === "High"
      ? "Multiple high-risk indicators were detected in the submitted opportunity."
      : riskLevel === "Medium"
        ? "Some warning indicators were detected. The opportunity should be verified before proceeding."
        : "No major high-risk pattern was detected from the submitted information.";

  return {
    riskScore,
    riskLevel,
    badge,

    redFlags,

    detectedSignals,
    informationalSignals,

    summary,

    recommendations,

    analyzedAt: new Date().toISOString(),
  };
};
