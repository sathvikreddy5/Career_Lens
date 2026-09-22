import dns from "dns/promises";

/* =========================================================
   DOMAIN NORMALIZATION
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

/* =========================================================
   DOMAIN FORMAT VALIDATION
========================================================= */

const isValidDomain = (domain) => {
  if (!domain) {
    return false;
  }

  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
    domain,
  );
};

/* =========================================================
   DOMAIN DNS VERIFICATION
========================================================= */

const verifyDomainExists = async (domain) => {
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
   MX VERIFICATION
========================================================= */

const verifyMxRecords = async (domain) => {
  /*
    First use the system DNS.
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
    Public DNS fallback.
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
   MAIN DOMAIN VERIFICATION
========================================================= */

export const verifyDomain = async (rawDomain = "") => {
  const domain = normalizeDomain(rawDomain);

  /* -------------------------------------------------------
     Missing domain
  ------------------------------------------------------- */

  if (!domain) {
    return {
      domain: "",

      validFormat: false,

      exists: false,

      hasMxRecords: false,

      mxRecords: [],

      checks: [
        {
          id: "domain",

          label: "Domain",

          status: "NOT_EVALUATED",

          message: "No domain was provided.",
        },
      ],
    };
  }

  /* -------------------------------------------------------
     Invalid domain
  ------------------------------------------------------- */

  if (!isValidDomain(domain)) {
    return {
      domain,

      validFormat: false,

      exists: false,

      hasMxRecords: false,

      mxRecords: [],

      checks: [
        {
          id: "domain_format",

          label: "Domain format",

          status: "WARNING",

          message: "The domain format is invalid.",
        },
      ],
    };
  }

  /* -------------------------------------------------------
     DNS
  ------------------------------------------------------- */

  const dnsResult = await verifyDomainExists(domain);

  /* -------------------------------------------------------
     MX
  ------------------------------------------------------- */

  const mxResult = await verifyMxRecords(domain);

  /* =======================================================
     CHECKS
  ======================================================= */

  const checks = [];

  /*
    Domain format
  */

  checks.push({
    id: "domain_format",

    label: "Domain format",

    status: "PASS",

    message: "The domain format is valid.",
  });

  /*
    Domain existence
  */

  if (dnsResult.exists) {
    checks.push({
      id: "domain_exists",

      label: "Domain exists",

      status: "PASS",

      message: "The domain resolves through DNS.",
    });
  } else {
    checks.push({
      id: "domain_exists",

      label: "Domain exists",

      status: "WARNING",

      message: "The domain could not be resolved through DNS.",
    });
  }

  /*
    MX records
  */

  if (mxResult.hasMxRecords) {
    checks.push({
      id: "mail_server",

      label: "Mail server",

      status: "PASS",

      message: "Mail server records were found for this domain.",
    });
  } else {
    checks.push({
      id: "mail_server",

      label: "Mail server",

      status: "WARNING",

      message: "No MX records were found for this domain.",
    });
  }

  /* =======================================================
     FINAL RESULT
  ======================================================= */

  return {
    domain,

    validFormat: true,

    exists: dnsResult.exists,

    addresses: dnsResult.addresses,

    hasMxRecords: mxResult.hasMxRecords,

    mxRecords: mxResult.mxRecords,

    mxSource: mxResult.source,

    checks,
  };
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  verifyDomain,
};
