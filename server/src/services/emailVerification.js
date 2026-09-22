import dns from "node:dns/promises";
import net from "node:net";

// ======================================================
// Basic Email Format
// ======================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ======================================================
// Free / Public Email Providers
// ======================================================

const FREE_EMAIL_PROVIDERS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
  "proton.me",
  "protonmail.com",
]);

// ======================================================
// Normalize Domain
// ======================================================

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
// Extract Email Domain
// ======================================================

export const extractEmailDomain = (email = "") => {
  if (!email || !email.includes("@")) {
    return null;
  }

  return normalizeDomain(email.split("@")[1]);
};

// ======================================================
// Validate Email Format
// ======================================================

const validateEmailFormat = (email = "") => {
  if (!email) {
    return {
      valid: false,
      status: "NOT_EVALUATED",
      description: "No recruiter email address was provided.",
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      status: "WARNING",
      description: "The provided email address does not have a valid format.",
    };
  }

  return {
    valid: true,
    status: "PASS",
    description: "The email address has a valid format.",
  };
};

// ======================================================
// MX Lookup
// ======================================================

const getMxRecords = async (domain) => {
  try {
    const records = await dns.resolveMx(domain);

    return records.sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
};

// ======================================================
// SMTP Connection Check
//
// IMPORTANT:
// This does NOT claim that the mailbox exists.
// Some providers intentionally hide mailbox status.
// ======================================================

const smtpMailboxCheck = async ({ host, email, timeout = 5000 }) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    let finished = false;

    const finish = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      socket.destroy();

      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({
        status: "NOT_VERIFIED",

        code: null,

        message:
          "The mail server did not provide a conclusive mailbox response within the verification timeout.",
      });
    }, timeout);

    socket.setTimeout(timeout);

    socket.connect(25, host, () => {
      socket.write(`EHLO careershield.local\r\n`);
    });

    let response = "";

    socket.on("data", (chunk) => {
      response += chunk.toString();

      // --------------------------------------------
      // SMTP greeting
      // --------------------------------------------

      if (response.includes("\r\n") && !response.includes("MAIL FROM")) {
        socket.write("MAIL FROM:<verify@careershield.local>\r\n");
      }

      // --------------------------------------------
      // Ask server about recipient
      // --------------------------------------------

      if (response.includes("MAIL FROM") && !response.includes("RCPT TO")) {
        socket.write(`RCPT TO:<${email}>\r\n`);
      }

      // --------------------------------------------
      // We have received an SMTP response
      // --------------------------------------------

      const lines = response.split("\r\n").filter(Boolean);

      const lastLine = lines[lines.length - 1] || "";

      const match = lastLine.match(/^(\d{3})/);

      if (!match) {
        return;
      }

      const code = Number(match[1]);

      // --------------------------------------------
      // Successful / accepted recipient
      // --------------------------------------------

      if (code >= 200 && code < 300) {
        clearTimeout(timer);

        finish({
          status: "INCONCLUSIVE",

          code,

          message:
            "The mail server accepted the SMTP recipient request, but this does not independently prove that the mailbox exists.",
        });

        return;
      }

      // --------------------------------------------
      // Temporary response
      // --------------------------------------------

      if (code >= 400 && code < 500) {
        clearTimeout(timer);

        finish({
          status: "NOT_VERIFIED",

          code,

          message:
            "The mail server returned a temporary response, so mailbox existence could not be verified.",
        });

        return;
      }

      // --------------------------------------------
      // Permanent rejection
      // --------------------------------------------

      if (code >= 500 && code < 600) {
        clearTimeout(timer);

        finish({
          status: "NOT_VERIFIED",

          code,

          message:
            "The mail server rejected the recipient request. This can indicate that the address is not accepted, but some providers intentionally hide mailbox information.",
        });
      }
    });

    socket.on("timeout", () => {
      clearTimeout(timer);

      finish({
        status: "NOT_VERIFIED",

        code: null,

        message: "SMTP verification timed out.",
      });
    });

    socket.on("error", () => {
      clearTimeout(timer);

      finish({
        status: "NOT_VERIFIED",

        code: null,

        message: "An SMTP connection could not be established.",
      });
    });
  });
};

// ======================================================
// Main Email Verification
// ======================================================

export const verifyEmailAddress = async (email = "") => {
  const normalizedEmail = email.trim().toLowerCase();

  // ----------------------------------------------------
  // Result object
  // ----------------------------------------------------

  const result = {
    email: normalizedEmail || null,

    format: {
      valid: null,
      status: "NOT_EVALUATED",
      description: "Email format was not evaluated.",
    },

    domain: {
      value: null,
      exists: null,
      status: "NOT_EVALUATED",
      description: "Email domain was not evaluated.",
    },

    mx: {
      exists: null,
      records: [],
      status: "NOT_EVALUATED",
      description: "MX records were not evaluated.",
    },

    mailbox: {
      status: "NOT_EVALUATED",
      code: null,
      message: "Mailbox existence was not evaluated.",
    },

    providerType: "NOT_EVALUATED",

    overallStatus: "NOT_EVALUATED",
  };

  // ----------------------------------------------------
  // Email format
  // ----------------------------------------------------

  const format = validateEmailFormat(normalizedEmail);

  result.format = format;

  if (!format.valid) {
    return result;
  }

  // ----------------------------------------------------
  // Extract domain
  // ----------------------------------------------------

  const domain = extractEmailDomain(normalizedEmail);

  result.domain.value = domain;

  if (!domain) {
    result.overallStatus = "WARNING";

    return result;
  }

  // ----------------------------------------------------
  // Public email provider
  // ----------------------------------------------------

  if (FREE_EMAIL_PROVIDERS.has(domain)) {
    result.providerType = "PUBLIC";
  } else {
    result.providerType = "PROFESSIONAL";
  }

  // ----------------------------------------------------
  // Domain DNS lookup
  // ----------------------------------------------------

  try {
    const addresses = await dns.lookup(domain, {
      all: true,
    });

    result.domain.exists = addresses.length > 0;

    if (result.domain.exists) {
      result.domain.status = "PASS";

      result.domain.description =
        "The email domain exists and resolves through DNS.";
    }
  } catch {
    result.domain.exists = false;

    result.domain.status = "WARNING";

    result.domain.description = "The email domain could not be resolved.";
  }

  // ----------------------------------------------------
  // MX records
  // ----------------------------------------------------

  const mxRecords = await getMxRecords(domain);

  result.mx.records = mxRecords;

  result.mx.exists = mxRecords.length > 0;

  if (result.mx.exists) {
    result.mx.status = "PASS";

    result.mx.description = "The domain has mail exchange (MX) records.";
  } else {
    result.mx.status = "WARNING";

    result.mx.description = "No MX records were found for this domain.";
  }

  // ----------------------------------------------------
  // If no MX records, don't attempt SMTP
  // ----------------------------------------------------

  if (!result.mx.exists) {
    result.mailbox = {
      status: "NOT_VERIFIED",

      code: null,

      message:
        "Mailbox verification was skipped because the domain has no MX records.",
    };

    result.overallStatus = "WARNING";

    return result;
  }

  // ----------------------------------------------------
  // SMTP mailbox-level check
  // ----------------------------------------------------

  const primaryMx = mxRecords[0]?.exchange;

  if (primaryMx) {
    result.mailbox = await smtpMailboxCheck({
      host: primaryMx,
      email: normalizedEmail,
    });
  }

  // ----------------------------------------------------
  // Overall status
  // ----------------------------------------------------

  if (result.domain.exists === true && result.mx.exists === true) {
    result.overallStatus = "DOMAIN_VERIFIED";
  } else {
    result.overallStatus = "WARNING";
  }

  return result;
};
