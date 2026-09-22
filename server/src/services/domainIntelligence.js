import dns from "dns/promises";

/* =========================================================
   DOMAIN HELPERS
========================================================= */

const normalizeDomain = (domain = "") => {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split(":")[0];
};

const isValidDomain = (domain) => {
  if (!domain) {
    return false;
  }

  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
    domain,
  );
};

/* =========================================================
   DNS LOOKUP
========================================================= */

const resolveDomain = async (domain) => {
  try {
    const addresses = await dns.lookup(domain, {
      all: true,
    });

    return {
      exists: addresses.length > 0,
      addresses: addresses.map((item) => item.address),
    };
  } catch {
    return {
      exists: false,
      addresses: [],
    };
  }
};

/* =========================================================
   MX LOOKUP
========================================================= */

const resolveMxRecords = async (domain) => {
  /*
    First try the local DNS resolver.
  */

  try {
    const records = await dns.resolveMx(domain);

    if (records?.length > 0) {
      return {
        hasMxRecords: true,
        mxRecords: records,
        source: "system_dns",
      };
    }
  } catch {
    // Continue with public DNS
  }

  /*
    Google Public DNS fallback.
  */

  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: {
          Accept: "application/dns-json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();

      const answers = Array.isArray(data?.Answer) ? data.Answer : [];

      const mxRecords = answers
        .filter((record) => record.type === 15 && record.data)
        .map((record) => {
          const parts = record.data.trim().split(/\s+/);

          return {
            priority: Number(parts[0]) || 0,

            exchange: parts[1] || "",
          };
        });

      if (mxRecords.length > 0) {
        return {
          hasMxRecords: true,
          mxRecords,
          source: "google_public_dns",
        };
      }
    }
  } catch {
    // Ignore fallback failure
  }

  return {
    hasMxRecords: false,
    mxRecords: [],
    source: null,
  };
};

/* =========================================================
   WEBSITE FETCH
========================================================= */

const fetchWebsite = async (domain) => {
  const urls = [`https://${domain}`, `http://${domain}`];

  for (const url of urls) {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,

        headers: {
          "User-Agent": "CareerShield/1.0",
        },
      });

      clearTimeout(timeout);

      const html = await response.text();

      return {
        reachable: true,

        https: url.startsWith("https://"),

        statusCode: response.status,

        finalUrl: response.url || url,

        html,
      };
    } catch {
      // Try next URL
    }
  }

  return {
    reachable: false,
    https: false,
    statusCode: null,
    finalUrl: null,
    html: "",
  };
};

/* =========================================================
   HTML TEXT EXTRACTION
========================================================= */

const extractPageText = (html = "") => {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

/* =========================================================
   TITLE
========================================================= */

const extractTitle = (html = "") => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  if (!match) {
    return "";
  }

  return match[1].replace(/\s+/g, " ").trim();
};

/* =========================================================
   META DESCRIPTION
========================================================= */

const extractMetaDescription = (html = "") => {
  const match = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  );

  if (match) {
    return match[1].trim();
  }

  return "";
};

/* =========================================================
   CAREERS LINK DETECTION
========================================================= */

const extractCareersLinks = (html = "", domain) => {
  const links = [];

  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const href = match[1]?.trim() || "";

    const anchorText =
      match[2]
        ?.replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim() || "";

    const combined = `${href} ${anchorText}`.toLowerCase();

    const isCareerLink =
      combined.includes("career") ||
      combined.includes("jobs") ||
      combined.includes("join-us") ||
      combined.includes("joinus") ||
      combined.includes("vacancies") ||
      combined.includes("work-with-us");

    if (!isCareerLink) {
      continue;
    }

    try {
      const absoluteUrl = new URL(href, `https://${domain}`).href;

      links.push({
        url: absoluteUrl,
        text: anchorText,
      });
    } catch {
      // Ignore invalid URL
    }
  }

  /*
    Remove duplicates.
  */

  const uniqueLinks = [];

  const seen = new Set();

  for (const link of links) {
    if (!seen.has(link.url)) {
      seen.add(link.url);
      uniqueLinks.push(link);
    }
  }

  return uniqueLinks.slice(0, 20);
};

/* =========================================================
   COMPANY LANGUAGE
========================================================= */

const detectCompanyLanguage = (text = "") => {
  const lower = text.toLowerCase();

  const keywords = [
    "about us",
    "about",
    "company",
    "our company",
    "our team",
    "services",
    "products",
    "contact us",
    "privacy policy",
    "terms",
  ];

  const matches = keywords.filter((keyword) => lower.includes(keyword));

  return {
    found: matches.length > 0,

    matches,
  };
};

/* =========================================================
   RDAP DOMAIN REGISTRATION
========================================================= */

const getDomainRegistrationDate = async (domain) => {
  try {
    const response = await fetch(
      `https://rdap.org/domain/${encodeURIComponent(domain)}`,
      {
        headers: {
          Accept: "application/rdap+json, application/json",
        },
      },
    );

    if (!response.ok) {
      return {
        registrationDate: null,

        source: null,
      };
    }

    const data = await response.json();

    const events = Array.isArray(data?.events) ? data.events : [];

    /*
        Preferred RDAP event.
      */

    const registrationEvent = events.find(
      (event) =>
        String(event?.eventAction || "").toLowerCase() === "registration",
    );

    if (registrationEvent?.eventDate) {
      const date = new Date(registrationEvent.eventDate);

      if (!Number.isNaN(date.getTime())) {
        return {
          registrationDate: date.toISOString(),

          source: "RDAP",
        };
      }
    }

    /*
        Creation event fallback.
      */

    const creationEvent = events.find(
      (event) => String(event?.eventAction || "").toLowerCase() === "creation",
    );

    if (creationEvent?.eventDate) {
      const date = new Date(creationEvent.eventDate);

      if (!Number.isNaN(date.getTime())) {
        return {
          registrationDate: date.toISOString(),

          source: "RDAP",
        };
      }
    }
  } catch {
    // Registration information unavailable
  }

  return {
    registrationDate: null,
    source: null,
  };
};

/* =========================================================
   DOMAIN AGE
========================================================= */

const calculateDomainAge = (registrationDate) => {
  /*
    IMPORTANT:

    Missing registration data stays null.

    We never convert unknown age to 0.
  */

  if (!registrationDate) {
    return {
      status: "NOT_EVALUATED",

      registrationDate: null,

      ageDays: null,

      description: "Domain registration age could not be verified.",
    };
  }

  const registeredAt = new Date(registrationDate);

  if (Number.isNaN(registeredAt.getTime())) {
    return {
      status: "NOT_EVALUATED",

      registrationDate: null,

      ageDays: null,

      description: "Domain registration age could not be verified.",
    };
  }

  const difference = Date.now() - registeredAt.getTime();

  const ageDays = Math.floor(difference / (1000 * 60 * 60 * 24));

  /*
    Invalid future date.
  */

  if (ageDays < 0) {
    return {
      status: "NOT_EVALUATED",

      registrationDate: registeredAt.toISOString(),

      ageDays: null,

      description: "Domain registration age could not be verified.",
    };
  }

  let description;

  if (ageDays === 0) {
    description = "Domain was registered within the last 24 hours.";
  } else if (ageDays === 1) {
    description = "Domain was registered approximately 1 day ago.";
  } else if (ageDays < 365) {
    description = `Domain was registered approximately ${ageDays} days ago.`;
  } else {
    const years = Math.floor(ageDays / 365);

    description = `Domain is approximately ${years} year${
      years === 1 ? "" : "s"
    } old.`;
  }

  return {
    status: ageDays < 90 ? "WARNING" : "PASS",

    registrationDate: registeredAt.toISOString(),

    ageDays,

    description,
  };
};

/* =========================================================
   MAIN DOMAIN ANALYSIS
========================================================= */

export const analyzeDomain = async (rawDomain = "") => {
  const domain = normalizeDomain(rawDomain);

  /* -----------------------------------------------------
       No domain
    ----------------------------------------------------- */

  if (!domain) {
    return {
      domain: "",

      validFormat: false,

      exists: false,

      mxRecords: [],

      hasMxRecords: false,

      website: {
        reachable: false,

        https: false,

        statusCode: null,

        finalUrl: null,
      },

      websiteEvidence: {
        title: "",

        metaDescription: "",

        companyLanguage: {
          found: false,

          matches: [],
        },
      },

      careers: {
        found: false,

        links: [],
      },

      domainAge: {
        status: "NOT_EVALUATED",

        registrationDate: null,

        ageDays: null,

        description: "No company domain was provided.",
      },

      checks: [
        {
          id: "company_domain",

          label: "Company domain",

          status: "NOT_EVALUATED",

          message: "No company domain was provided.",
        },
      ],
    };
  }

  /* -----------------------------------------------------
       Invalid domain
    ----------------------------------------------------- */

  if (!isValidDomain(domain)) {
    return {
      domain,

      validFormat: false,

      exists: false,

      mxRecords: [],

      hasMxRecords: false,

      website: {
        reachable: false,

        https: false,

        statusCode: null,

        finalUrl: null,
      },

      websiteEvidence: {
        title: "",

        metaDescription: "",

        companyLanguage: {
          found: false,

          matches: [],
        },
      },

      careers: {
        found: false,

        links: [],
      },

      domainAge: {
        status: "NOT_EVALUATED",

        registrationDate: null,

        ageDays: null,

        description: "The company domain format is invalid.",
      },

      checks: [
        {
          id: "company_domain",

          label: "Company domain",

          status: "WARNING",

          message: "The company domain format is invalid.",
        },
      ],
    };
  }

  /* -----------------------------------------------------
       Run domain checks
    ----------------------------------------------------- */

  const dnsResult = await resolveDomain(domain);

  const mxResult = await resolveMxRecords(domain);

  const website = await fetchWebsite(domain);

  /* -----------------------------------------------------
       Website evidence
    ----------------------------------------------------- */

  const pageText = extractPageText(website.html);

  const title = extractTitle(website.html);

  const metaDescription = extractMetaDescription(website.html);

  const companyLanguage = detectCompanyLanguage(pageText);

  /* -----------------------------------------------------
       Careers
    ----------------------------------------------------- */

  const careersLinks = extractCareersLinks(website.html, domain);

  /* -----------------------------------------------------
       Domain age
    ----------------------------------------------------- */

  const registration = await getDomainRegistrationDate(domain);

  const domainAge = calculateDomainAge(registration.registrationDate);

  /* =====================================================
       CHECKS
    ===================================================== */

  const checks = [];

  /*
      Domain format
    */

  checks.push({
    id: "company_domain",

    label: "Company domain",

    status: "PASS",

    message: "Company domain format is valid.",
  });

  /*
      DNS
    */

  if (dnsResult.exists) {
    checks.push({
      id: "domain_exists",

      label: "Company domain exists",

      status: "PASS",

      message: "The company domain resolves through DNS.",
    });
  } else {
    checks.push({
      id: "domain_exists",

      label: "Company domain exists",

      status: "WARNING",

      message: "The company domain could not be resolved through DNS.",
    });
  }

  /*
      Company mail infrastructure
    */

  if (mxResult.hasMxRecords) {
    checks.push({
      id: "company_mail_infrastructure",

      label: "Company mail infrastructure",

      status: "PASS",

      message: `Mail infrastructure detected for ${domain}.`,
    });
  } else {
    checks.push({
      id: "company_mail_infrastructure",

      label: "Company mail infrastructure",

      status: "WARNING",

      message: "No MX records were found for the company domain.",
    });
  }

  /*
      Website
    */

  if (website.reachable) {
    checks.push({
      id: "company_website",

      label: "Company website reachable",

      status: "PASS",

      message: `Company website responded with HTTP status ${website.statusCode}.`,
    });
  } else {
    checks.push({
      id: "company_website",

      label: "Company website reachable",

      status: "WARNING",

      message: "The company website could not be reached.",
    });
  }

  /*
      HTTPS
    */

  if (website.reachable) {
    if (website.https) {
      checks.push({
        id: "https",

        label: "HTTPS available",

        status: "PASS",

        message: "The company website is accessible over HTTPS.",
      });
    } else {
      checks.push({
        id: "https",

        label: "HTTPS available",

        status: "WARNING",

        message:
          "The company website is reachable but HTTPS was not confirmed.",
      });
    }
  }

  /*
      Company information
    */

  if (companyLanguage.found) {
    checks.push({
      id: "company_information",

      label: "Company information detected",

      status: "PASS",

      message: "The website contains common company/business information.",
    });
  } else if (website.reachable) {
    checks.push({
      id: "company_information",

      label: "Company information detected",

      status: "WARNING",

      message: "Limited company information was detected on the website.",
    });
  }

  /*
      Careers
    */

  if (careersLinks.length > 0) {
    checks.push({
      id: "careers_information",

      label: "Careers information detected",

      status: "PASS",

      message: `Found ${careersLinks.length} career/job related link${
        careersLinks.length === 1 ? "" : "s"
      } on the company website.`,
    });
  } else if (website.reachable) {
    checks.push({
      id: "careers_information",

      label: "Careers information detected",

      status: "NOT_EVALUATED",

      message: "No careers or jobs link was detected on the company website.",
    });
  }

  /*
      Domain age

      IMPORTANT:
      Unknown age does NOT become suspicious.
    */

  if (domainAge.ageDays !== null && domainAge.ageDays !== undefined) {
    if (domainAge.ageDays < 90) {
      checks.push({
        id: "domain_age",

        label: "Domain registration age",

        status: "WARNING",

        message: `Domain was registered approximately ${domainAge.ageDays} days ago.`,
      });
    } else {
      checks.push({
        id: "domain_age",

        label: "Domain registration age",

        status: "PASS",

        message: domainAge.description,
      });
    }
  } else {
    checks.push({
      id: "domain_age",

      label: "Domain registration age",

      status: "NOT_EVALUATED",

      message: "Domain registration age could not be verified.",
    });
  }

  /* =====================================================
       FINAL RESULT
    ===================================================== */

  return {
    domain,

    validFormat: true,

    exists: dnsResult.exists,

    dns: {
      addresses: dnsResult.addresses,
    },

    mxRecords: mxResult.mxRecords,

    hasMxRecords: mxResult.hasMxRecords,

    mxSource: mxResult.source,

    website: {
      reachable: website.reachable,

      https: website.https,

      statusCode: website.statusCode,

      finalUrl: website.finalUrl,
    },

    websiteEvidence: {
      title,

      metaDescription,

      companyLanguage,

      pageTextLength: pageText.length,
    },

    careers: {
      found: careersLinks.length > 0,

      links: careersLinks,
    },

    domainAge,

    checks,
  };
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  analyzeDomain,
};
