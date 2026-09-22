const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const tokenize = (text = "") => {
  return new Set(
    normalizeText(text)
      .split(" ")
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            "the",
            "and",
            "for",
            "with",
            "from",
            "this",
            "that",
            "are",
            "you",
            "your",
            "our",
            "job",
            "role",
            "work",
          ].includes(word),
      ),
  );
};

const similarity = (a = "", b = "") => {
  const first = tokenize(a);
  const second = tokenize(b);

  if (!first.size || !second.size) {
    return 0;
  }

  let intersection = 0;

  for (const word of first) {
    if (second.has(word)) {
      intersection++;
    }
  }

  const union = new Set([...first, ...second]).size;

  return union ? intersection / union : 0;
};

// ======================================================
// Extract Careers Links
// ======================================================

const extractCareerLinks = (html = "", baseUrl = "") => {
  const links = [];

  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const href = match[1];

    const label = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const combined = `${href} ${label}`.toLowerCase();

    if (
      /career|careers|jobs|job-opening|vacanc|join-us|work-with-us|employment/.test(
        combined,
      )
    ) {
      try {
        const url = new URL(href, baseUrl).href;

        links.push({
          url,
          label,
        });
      } catch {
        // Ignore malformed URLs
      }
    }
  }

  return [...new Map(links.map((item) => [item.url, item])).values()].slice(
    0,
    10,
  );
};

// ======================================================
// Fetch Page
// ======================================================

const fetchPage = async (url) => {
  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "CareerShield/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    return {
      url: response.url,
      html,
    };
  } catch {
    return null;
  }
};

// ======================================================
// Extract Page Text
// ======================================================

const extractText = (html = "") => {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// ======================================================
// Verify Opportunity Against Careers Pages
// ======================================================

export const verifyOfficialOpportunity = async ({
  companyDomain = "",
  description = "",
  companyName = "",
}) => {
  const result = {
    status: "NOT_EVALUATED",

    found: false,

    careersPage: null,

    matchedPage: null,

    similarity: 0,

    titleMatch: false,

    locationMatch: false,

    evidence: null,

    checks: [],
  };

  if (!companyDomain) {
    result.checks.push({
      id: "official_careers",

      status: "NOT_EVALUATED",

      title: "Official careers verification",

      description: "No company domain was provided.",
    });

    return result;
  }

  if (!description.trim()) {
    result.checks.push({
      id: "official_careers",

      status: "NOT_EVALUATED",

      title: "Official careers verification",

      description: "No opportunity description was provided.",
    });

    return result;
  }

  const domain = companyDomain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  // --------------------------------------------------
  // Get homepage
  // --------------------------------------------------

  const homepage = await fetchPage(`https://${domain}`);

  if (!homepage) {
    result.checks.push({
      id: "official_careers",

      status: "NOT_EVALUATED",

      title: "Official careers verification",

      description:
        "The company website could not be reached, so the exact opportunity could not be checked.",
    });

    return result;
  }

  // --------------------------------------------------
  // Find careers links
  // --------------------------------------------------

  const careerLinks = extractCareerLinks(homepage.html, homepage.url);

  if (!careerLinks.length) {
    result.checks.push({
      id: "official_careers",

      status: "NOT_EVALUATED",

      title: "Official careers verification",

      description:
        "No careers or jobs page could be identified from the company website.",
    });

    return result;
  }

  result.careersPage = careerLinks[0].url;

  // --------------------------------------------------
  // Search career pages
  // --------------------------------------------------

  let bestMatch = null;

  for (const careerLink of careerLinks) {
    const page = await fetchPage(careerLink.url);

    if (!page) {
      continue;
    }

    const text = extractText(page.html);

    const score = similarity(description, text);

    const normalizedDescription = normalizeText(description);

    const normalizedPage = normalizeText(text);

    const descriptionWords = normalizedDescription
      .split(" ")
      .filter((word) => word.length > 3);

    const titleCandidates = descriptionWords.slice(0, 8);

    const titleMatch = titleCandidates.some((word) =>
      normalizedPage.includes(word),
    );

    const locationMatch =
      /\bhyderabad\b/i.test(description) && /\bhyderabad\b/i.test(text);

    if (!bestMatch || score > bestMatch.similarity) {
      bestMatch = {
        url: page.url,

        similarity: score,

        titleMatch,

        locationMatch,
      };
    }
  }

  if (!bestMatch) {
    result.checks.push({
      id: "official_careers",

      status: "NOT_EVALUATED",

      title: "Official careers verification",

      description:
        "A careers page was found, but its contents could not be analyzed.",
    });

    return result;
  }

  result.matchedPage = bestMatch.url;

  result.similarity = Number(bestMatch.similarity.toFixed(2));

  result.titleMatch = bestMatch.titleMatch;

  result.locationMatch = bestMatch.locationMatch;

  // --------------------------------------------------
  // Determine result
  // --------------------------------------------------

  if (
    bestMatch.similarity >= 0.35 &&
    (bestMatch.titleMatch || bestMatch.locationMatch)
  ) {
    result.found = true;

    result.status = "PASS";

    result.evidence = {
      companyName: companyName || null,

      careersPage: bestMatch.url,

      similarity: result.similarity,

      titleMatch: result.titleMatch,

      locationMatch: result.locationMatch,
    };

    result.checks.push({
      id: "official_careers",

      status: "PASS",

      title: "Matching opportunity found on official careers site",

      description:
        "The submitted opportunity has matching evidence on a careers page associated with the provided company domain.",
    });
  } else {
    result.status = "WARNING";

    result.checks.push({
      id: "official_careers",

      status: "WARNING",

      title: "Exact opportunity not confirmed",

      description:
        "A company careers page was found, but the submitted opportunity could not be sufficiently matched to it.",
    });
  }

  return result;
};
