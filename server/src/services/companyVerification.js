import { verifyEmailAddress, extractEmailDomain } from "./emailVerification.js";

import { analyzeDomain } from "./domainIntelligence.js";

import { verifyOfficialOpportunity } from "./careersVerification.js";

const normalizeDomain = (domain = "") => {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split(":")[0];
};

const FREE_EMAIL_PROVIDERS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
  "proton.me",
  "protonmail.com",
]);

export const verifyCompanyContact = async ({
  contactEmail = "",
  companyDomain = "",
  description = "",
  companyName = "",
}) => {
  const normalizedEmail = contactEmail.trim().toLowerCase();

  const normalizedCompanyDomain = normalizeDomain(companyDomain);

  const result = {
    contactDomain: extractEmailDomain(normalizedEmail),

    companyDomain: normalizedCompanyDomain || null,

    emailType: "NOT_EVALUATED",

    domainMatch: null,

    emailVerification: null,

    domainIntelligence: null,

    officialOpportunity: null,

    checks: [],
  };

  // =====================================================
  // EMAIL TYPE
  // =====================================================

  const contactDomain = result.contactDomain;

  if (!normalizedEmail) {
    result.emailType = "NOT_EVALUATED";

    result.checks.push({
      id: "email_type",

      status: "NOT_EVALUATED",

      title: "Recruiter email type",

      description: "No recruiter email address was provided.",
    });
  } else if (contactDomain && FREE_EMAIL_PROVIDERS.has(contactDomain)) {
    result.emailType = "PUBLIC";

    result.checks.push({
      id: "email_type",

      status: "WARNING",

      title: "Public email provider",

      description:
        "The recruiter is using a public email provider instead of a company-specific email domain.",
    });
  } else {
    result.emailType = "PROFESSIONAL";

    result.checks.push({
      id: "email_type",

      status: "PASS",

      title: "Professional email domain",

      description: "The recruiter email uses a domain-specific email address.",
    });
  }

  // =====================================================
  // EMAIL VERIFICATION
  // =====================================================

  if (normalizedEmail) {
    const emailVerification = await verifyEmailAddress(normalizedEmail);

    result.emailVerification = emailVerification;

    // Email format

    if (emailVerification.format?.status === "PASS") {
      result.checks.push({
        id: "email_format",

        status: "PASS",

        title: "Email format",

        description: emailVerification.format.description,
      });
    } else if (emailVerification.format?.status === "WARNING") {
      result.checks.push({
        id: "email_format",

        status: "WARNING",

        title: "Email format",

        description: emailVerification.format.description,
      });
    } else {
      result.checks.push({
        id: "email_format",

        status: "NOT_EVALUATED",

        title: "Email format",

        description: "Email format could not be evaluated.",
      });
    }

    // Domain

    if (emailVerification.domain?.status === "PASS") {
      result.checks.push({
        id: "email_domain",

        status: "PASS",

        title: "Email domain",

        description: emailVerification.domain.description,
      });
    } else {
      result.checks.push({
        id: "email_domain",

        status: "WARNING",

        title: "Email domain",

        description:
          emailVerification.domain?.description ||
          "The email domain could not be verified.",
      });
    }

    // MX records

    if (emailVerification.mx?.status === "PASS") {
      result.checks.push({
        id: "mx_records",

        status: "PASS",

        title: "Mail server",

        description: emailVerification.mx.description,
      });
    } else {
      result.checks.push({
        id: "mx_records",

        status: "WARNING",

        title: "Mail server",

        description:
          emailVerification.mx?.description ||
          "Mail server information could not be verified.",
      });
    }

    // Mailbox

    if (emailVerification.mailbox?.status === "INCONCLUSIVE") {
      result.checks.push({
        id: "mailbox",

        status: "NOT_EVALUATED",

        title: "Specific mailbox",

        description:
          "The mail server responded, but this does not prove that the specific mailbox exists.",
      });
    } else if (emailVerification.mailbox?.status === "NOT_VERIFIED") {
      result.checks.push({
        id: "mailbox",

        status: "NOT_EVALUATED",

        title: "Specific mailbox",

        description:
          emailVerification.mailbox?.message ||
          "The specific mailbox could not be verified.",
      });
    } else {
      result.checks.push({
        id: "mailbox",

        status: "NOT_EVALUATED",

        title: "Specific mailbox",

        description: "Mailbox ownership requires email verification.",
      });
    }
  }

  // =====================================================
  // EMAIL DOMAIN MATCH
  // =====================================================

  if (contactDomain && normalizedCompanyDomain) {
    result.domainMatch = contactDomain === normalizedCompanyDomain;

    if (result.domainMatch) {
      result.checks.push({
        id: "domain_match",

        status: "PASS",

        title: "Email and company domains match",

        description:
          "The recruiter email domain matches the company domain provided.",
      });
    } else {
      result.checks.push({
        id: "domain_match",

        status: "WARNING",

        title: "Email and company domains do not match",

        description:
          "The recruiter email domain differs from the company domain provided.",
      });
    }
  } else {
    result.domainMatch = null;

    result.checks.push({
      id: "domain_match",

      status: "NOT_EVALUATED",

      title: "Email and company domain match",

      description:
        "Both a recruiter email domain and company domain are required for this check.",
    });
  }

  // =====================================================
  // COMPANY DOMAIN INTELLIGENCE
  // =====================================================

  if (normalizedCompanyDomain) {
    const domainIntelligence = await analyzeDomain(normalizedCompanyDomain);

    result.domainIntelligence = domainIntelligence;

    if (domainIntelligence.exists === true) {
      result.checks.push({
        id: "company_domain",

        status: "PASS",

        title: "Company domain exists",

        description: "The company domain could be resolved through DNS.",
      });
    } else if (domainIntelligence.exists === false) {
      result.checks.push({
        id: "company_domain",

        status: "WARNING",

        title: "Company domain",

        description: "The company domain could not be resolved.",
      });
    } else {
      result.checks.push({
        id: "company_domain",

        status: "NOT_EVALUATED",

        title: "Company domain",

        description: "The company domain could not be evaluated.",
      });
    }

    // MX

    if (domainIntelligence.hasMxRecords === true) {
      result.checks.push({
        id: "company_mx",

        status: "PASS",

        title: "Company mail infrastructure",

        description: "The company domain has mail exchange records.",
      });
    } else if (domainIntelligence.hasMxRecords === false) {
      result.checks.push({
        id: "company_mx",

        status: "WARNING",

        title: "Company mail infrastructure",

        description: "No MX records could be verified for the company domain.",
      });
    } else {
      result.checks.push({
        id: "company_mx",

        status: "NOT_EVALUATED",

        title: "Company mail infrastructure",

        description: "Mail infrastructure could not be evaluated.",
      });
    }

    // Website

    if (domainIntelligence.website?.reachable === true) {
      result.checks.push({
        id: "company_website",

        status: "PASS",

        title: "Company website reachable",

        description:
          "A website associated with the company domain could be reached.",
      });
    } else if (domainIntelligence.website?.reachable === false) {
      result.checks.push({
        id: "company_website",

        status: "WARNING",

        title: "Company website",

        description: "The company website could not be reached.",
      });
    } else {
      result.checks.push({
        id: "company_website",

        status: "NOT_EVALUATED",

        title: "Company website",

        description: "The company website could not be evaluated.",
      });
    }

    // HTTPS

    if (domainIntelligence.website?.https === true) {
      result.checks.push({
        id: "https",

        status: "PASS",

        title: "HTTPS available",

        description: "The company website is available over HTTPS.",
      });
    }

    // Company information

    if (domainIntelligence.websiteEvidence?.companyLanguage) {
      result.checks.push({
        id: "company_information",

        status: "PASS",

        title: "Company information detected",

        description:
          "The website contains information indicating an organization or company presence.",
      });
    }

    // Careers information

    if (domainIntelligence.careers?.found === true) {
      result.checks.push({
        id: "careers_information",

        status: "PASS",

        title: "Careers information detected",

        description: "The company website contains a careers or jobs section.",
      });
    } else if (domainIntelligence.careers?.found === false) {
      result.checks.push({
        id: "careers_information",

        status: "NOT_EVALUATED",

        title: "Careers information",

        description:
          "A careers section could not be identified from the company website.",
      });
    }

    // Domain age

    const ageDays = domainIntelligence.domainAge?.ageDays;

    if (Number.isFinite(Number(ageDays))) {
      if (Number(ageDays) < 90) {
        result.checks.push({
          id: "domain_age",

          status: "WARNING",

          title: "Recently registered domain",

          description: `The company domain appears to be approximately ${Math.round(
            Number(ageDays),
          )} days old.`,
        });
      } else {
        result.checks.push({
          id: "domain_age",

          status: "PASS",

          title: "Domain registration history",

          description: `The company domain appears to be approximately ${Math.round(
            Number(ageDays),
          )} days old.`,
        });
      }
    } else {
      result.checks.push({
        id: "domain_age",

        status: "NOT_EVALUATED",

        title: "Domain registration history",

        description: "Domain registration age could not be verified.",
      });
    }
  } else {
    result.domainIntelligence = null;

    result.checks.push({
      id: "company_domain",

      status: "NOT_EVALUATED",

      title: "Company domain",

      description: "No company domain was provided.",
    });
  }

  // =====================================================
  // EXACT OFFICIAL CAREERS VERIFICATION
  // =====================================================

  if (normalizedCompanyDomain && description.trim()) {
    const officialOpportunity = await verifyOfficialOpportunity({
      companyDomain: normalizedCompanyDomain,

      description,

      companyName,
    });

    result.officialOpportunity = officialOpportunity;

    for (const check of officialOpportunity.checks) {
      result.checks.push(check);
    }
  } else {
    result.officialOpportunity = null;

    result.checks.push({
      id: "official_careers",

      status: "NOT_EVALUATED",

      title: "Official careers verification",

      description:
        "A company domain and opportunity description are required to verify the opportunity against an official careers page.",
    });
  }

  return result;
};
