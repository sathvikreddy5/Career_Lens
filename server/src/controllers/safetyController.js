import prisma from "../config/prisma.js";
import { scorePosting } from "../services/safetyScoring.js";
import { detectDuplicates } from "../services/duplicateDetection.js";
import { verifyCompanyContact } from "../services/companyVerification.js";
import { analyzeWithML } from "../services/ml/fraudDetection.js";

export const analyzeOpportunity = async (req, res) => {
  console.log("=================================");
  console.log("SAFETY ANALYZE ENDPOINT HIT");
  console.log("REQUEST BODY:", req.body);
  console.log("=================================");
  try {
    const userId = req.user.userId;

    // ==================================================
    // INPUT
    // ==================================================

    const {
      description = "",
      contactEmail = "",
      companyName = "",
      companyDomain = "",

      // Optional values for future/community features
      domainAgeDays = null,
      weightedReports = 0,

      // Optional frontend values
      emailVerifiedAgainstDomain = false,
      cinVerified = false,
      foundOnOfficialCareersPage = false,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!description.trim()) {
      return res.status(400).json({
        message: "Opportunity description is required.",
      });
    }

    // ==================================================
    // FIND PREVIOUS POSTINGS
    // ==================================================

    const previousPostings = await prisma.opportunityPosting.findMany({
      where: {
        NOT: {
          userId,
        },
      },

      select: {
        id: true,
        companyName: true,
        description: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 500,
    });

    // ==================================================
    // DUPLICATE JOB DESCRIPTION DETECTION
    // ==================================================

    const duplicateResult = detectDuplicates(description, previousPostings);

    // ==================================================
    // COMPANY / EMAIL / DOMAIN VERIFICATION
    // ==================================================

    const companyVerification = await verifyCompanyContact({
      contactEmail,
      companyDomain,
      description,
      companyName,
    });

    // ==================================================
    // ML FRAUD DETECTION
    // ==================================================

    const mlAnalysis = await analyzeWithML({
      description,
    });

    console.log("ML ANALYSIS RESULT:", mlAnalysis);

    // ==================================================
    // OFFICIAL CAREERS VERIFICATION
    // ==================================================

    const officialOpportunity = companyVerification.officialOpportunity;

    // ==================================================
    // COMBINED RISK SCORE
    // ==================================================

    const result = scorePosting({
      // Basic information
      description,
      contactEmail,
      companyName,
      companyDomain,

      // ----------------------------------------------
      // Email domain
      // ----------------------------------------------

      contactDomain: companyVerification.contactDomain,

      // ----------------------------------------------
      // Duplicate detection
      // ----------------------------------------------

      duplicateClusterSize: duplicateResult.clusterSize,

      // ----------------------------------------------
      // Domain age
      // ----------------------------------------------

      domainAgeDays:
        companyVerification.domainIntelligence?.domainAge?.ageDays ??
        domainAgeDays ??
        null,

      // ----------------------------------------------
      // Community reports
      // ----------------------------------------------

      weightedReports,

      // ----------------------------------------------
      // Email/company domain match
      // ----------------------------------------------

      emailVerifiedAgainstDomain:
        companyVerification.domainMatch === true ||
        emailVerifiedAgainstDomain === true,

      // ----------------------------------------------
      // Company registration
      // ----------------------------------------------

      cinVerified,

      // ----------------------------------------------
      // Official careers verification
      //
      // IMPORTANT:
      // A careers page existing is NOT enough.
      // It must have a matching opportunity.
      // ----------------------------------------------

      foundOnOfficialCareersPage:
        officialOpportunity?.found === true ||
        foundOnOfficialCareersPage === true,

      // ----------------------------------------------
      // Machine learning fraud probability
      // ----------------------------------------------

      mlFraudProbability: mlAnalysis.fraudProbability,
    });

    // ==================================================
    // BUILD RISK REASONS
    // ==================================================

    const reasons = [...result.reasons];

    // ==================================================
    // ADD DUPLICATE EVIDENCE
    // ==================================================

    if (
      duplicateResult.isDuplicate &&
      !reasons.some((reason) => reason.id === "duplicate_jd")
    ) {
      reasons.push({
        id: "duplicate_jd",

        title: "Similar job descriptions detected",

        description: `This opportunity is highly similar to ${duplicateResult.matches.length} previously analyzed posting(s).`,

        weight: 30,
      });
    }

    // ==================================================
    // REMOVE DUPLICATE REASONS
    // ==================================================

    const uniqueReasons = [];

    const seenReasons = new Set();

    for (const reason of reasons) {
      if (!seenReasons.has(reason.id)) {
        seenReasons.add(reason.id);

        uniqueReasons.push(reason);
      }
    }

    // ==================================================
    // SAVE ANALYSIS
    // ==================================================

    const posting = await prisma.opportunityPosting.create({
      data: {
        userId,

        // --------------------------------------------
        // Submitted information
        // --------------------------------------------

        companyName: companyName.trim() || null,

        contactEmail: contactEmail.trim() || null,

        description: description.trim(),

        // --------------------------------------------
        // Final risk result
        // --------------------------------------------

        riskScore: result.riskScore,

        badge: result.badge,

        // --------------------------------------------
        // Duplicate cluster
        // --------------------------------------------

        duplicateClusterSize: duplicateResult.clusterSize,

        // --------------------------------------------
        // Detailed analysis
        // --------------------------------------------

        analysisDetails: {
          // Risk reasons
          reasons: uniqueReasons,

          // Positive verification signals
          positiveSignals: result.positiveSignals,

          // Email + company + domain
          // verification
          companyVerification,

          // ML analysis
          mlAnalysis,

          // Duplicate detection
          duplicateDetection: {
            isDuplicate: duplicateResult.isDuplicate,

            clusterSize: duplicateResult.clusterSize,

            matches: duplicateResult.matches,
          },
        },
      },
    });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      id: posting.id,

      // ----------------------------------------------
      // Final risk result
      // ----------------------------------------------

      riskScore: result.riskScore,

      badge: result.badge,

      // ----------------------------------------------
      // Risk reasons
      // ----------------------------------------------

      reasons: uniqueReasons,

      // ----------------------------------------------
      // Positive signals
      // ----------------------------------------------

      positiveSignals: result.positiveSignals,

      // ----------------------------------------------
      // Company verification
      // ----------------------------------------------

      companyVerification,

      // ----------------------------------------------
      // ML analysis
      // ----------------------------------------------

      mlAnalysis,

      // ----------------------------------------------
      // Duplicate detection
      // ----------------------------------------------

      duplicateDetection: {
        isDuplicate: duplicateResult.isDuplicate,

        clusterSize: duplicateResult.clusterSize,

        matches: duplicateResult.matches,
      },

      // ----------------------------------------------
      // Timestamp
      // ----------------------------------------------

      computedAt: result.computedAt,
    });
  } catch (error) {
    console.error("ANALYZE OPPORTUNITY ERROR:", error);

    return res.status(500).json({
      message: "Unable to analyze the opportunity.",
    });
  }
};
