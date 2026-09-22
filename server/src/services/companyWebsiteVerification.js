const normalizeDomain = (domain = "") => {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split(":")[0];
};

// ======================================================
// Fetch Website
// ======================================================

const fetchWebsite = async (url) => {
  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url, {
      method: "GET",

      redirect: "follow",

      signal: controller.signal,

      headers: {
        "User-Agent": "CareerShield/1.0 Website Verification",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    const html = await response.text();

    return {
      success: true,

      statusCode: response.status,

      finalUrl: response.url,

      contentType: response.headers.get("content-type"),

      html,
    };
  } catch (error) {
    return {
      success: false,

      statusCode: null,

      finalUrl: null,

      contentType: null,

      html: "",

      error: error.name === "AbortError" ? "TIMEOUT" : error.message,
    };
  }
};

// ======================================================
// Extract Basic Website Evidence
// ======================================================

const extractWebsiteEvidence = (html = "") => {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  const descriptionMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  );

  const normalizedHtml = html.toLowerCase();

  const hasCompanyLanguage =
    /about us|about company|our company|who we are|careers|career|contact us/i.test(
      html,
    );

  const hasCareerPageReference =
    /career|careers|jobs|job openings|work with us|join us/i.test(html);

  return {
    title: titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : null,

    description: descriptionMatch
      ? descriptionMatch[1].replace(/\s+/g, " ").trim()
      : null,

    hasCompanyLanguage,

    hasCareerPageReference,

    contentLength: normalizedHtml.length,
  };
};

// ======================================================
// Company Website Verification
// ======================================================

export const verifyCompanyWebsite = async (domain = "") => {
  const normalizedDomain = normalizeDomain(domain);

  const result = {
    domain: normalizedDomain || null,

    websiteReachable: null,

    httpsAvailable: null,

    status: "NOT_EVALUATED",

    finalUrl: null,

    statusCode: null,

    evidence: {
      title: null,
      description: null,
      hasCompanyLanguage: false,
      hasCareerPageReference: false,
    },

    checks: [],
  };

  // --------------------------------------------------
  // No domain
  // --------------------------------------------------

  if (!normalizedDomain) {
    result.checks.push({
      id: "company_website",

      status: "NOT_EVALUATED",

      title: "Company website",

      description:
        "No company domain was provided, so the company website could not be evaluated.",
    });

    return result;
  }

  // --------------------------------------------------
  // HTTPS check
  // --------------------------------------------------

  const httpsResult = await fetchWebsite(`https://${normalizedDomain}`);

  if (httpsResult.success) {
    result.httpsAvailable = true;

    result.websiteReachable =
      httpsResult.statusCode >= 200 && httpsResult.statusCode < 500;

    result.finalUrl = httpsResult.finalUrl;

    result.statusCode = httpsResult.statusCode;

    result.evidence = extractWebsiteEvidence(httpsResult.html);
  } else {
    result.httpsAvailable = false;

    // ----------------------------------------------
    // Fallback to HTTP
    // ----------------------------------------------

    const httpResult = await fetchWebsite(`http://${normalizedDomain}`);

    if (httpResult.success) {
      result.websiteReachable =
        httpResult.statusCode >= 200 && httpResult.statusCode < 500;

      result.finalUrl = httpResult.finalUrl;

      result.statusCode = httpResult.statusCode;

      result.evidence = extractWebsiteEvidence(httpResult.html);
    } else {
      result.websiteReachable = false;
    }
  }

  // --------------------------------------------------
  // Website result
  // --------------------------------------------------

  if (result.websiteReachable === true) {
    result.status = "PASS";

    result.checks.push({
      id: "company_website",

      status: "PASS",

      title: "Company website reachable",

      description: `A website was reachable for ${normalizedDomain}.`,
    });
  } else {
    result.status = "WARNING";

    result.checks.push({
      id: "company_website",

      status: "WARNING",

      title: "Company website could not be reached",

      description: `A website could not be reached for ${normalizedDomain}.`,
    });
  }

  // --------------------------------------------------
  // HTTPS
  // --------------------------------------------------

  if (result.httpsAvailable === true) {
    result.checks.push({
      id: "https",

      status: "PASS",

      title: "HTTPS available",

      description: "The company website is accessible over HTTPS.",
    });
  } else {
    result.checks.push({
      id: "https",

      status: "WARNING",

      title: "HTTPS could not be confirmed",

      description:
        "The company website could not be confirmed as accessible over HTTPS.",
    });
  }

  return result;
};
