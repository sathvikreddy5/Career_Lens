import prisma from "../config/prisma.js";
import { analyzeOpportunity } from "../services/opportunitySafetyService.js";
import { extractTextFromImage } from "../services/ocrService.js"; // ============================================================
// Analyze Opportunity
// POST /api/opportunity/analyze
// ============================================================

// ============================================================
// Analyze Opportunity
// POST /api/opportunity/analyze
// ============================================================

export const analyzeOpportunityPost = async (req, res) => {
  try {
    let { companyName = "", contactEmail = "", description = "" } = req.body;

    let extractedText = "";

    // ----------------------------------------------------------
    // Image OCR
    // ----------------------------------------------------------

    if (req.file) {
      try {
        extractedText = await extractTextFromImage(req.file.buffer);
      } catch (ocrError) {
        console.error("OCR error:", ocrError);

        return res.status(400).json({
          message:
            "Unable to read text from the uploaded image. Please try a clearer image.",
        });
      }
    }

    // ----------------------------------------------------------
    // Combine typed text + OCR text
    // ----------------------------------------------------------

    if (extractedText) {
      if (description.trim()) {
        description = `${description.trim()}\n\n${extractedText}`;
      } else {
        description = extractedText;
      }
    }

    // ----------------------------------------------------------
    // Validation
    // ----------------------------------------------------------

    if (!description.trim()) {
      return res.status(400).json({
        message:
          "Please paste opportunity details or upload an image containing the opportunity.",
      });
    }

    // ----------------------------------------------------------
    // Analyze opportunity
    // ----------------------------------------------------------

    const analysis = analyzeOpportunity({
      companyName,
      contactEmail,
      description,
    });

    // ----------------------------------------------------------
    // Save analysis to database
    // ----------------------------------------------------------

    const opportunity = await prisma.opportunityPosting.create({
      data: {
        userId: req.user.userId,

        companyName: companyName.trim() || null,

        contactEmail: contactEmail.trim() || null,

        description: description.trim(),

        riskScore: analysis.riskScore,

        badge: analysis.badge,

        analysisDetails: {
          riskLevel: analysis.riskLevel,

          badge: analysis.badge,

          summary: analysis.summary,

          redFlags: analysis.redFlags,

          detectedSignals: analysis.detectedSignals,

          informationalSignals: analysis.informationalSignals,

          recommendations: analysis.recommendations,

          analyzedAt: analysis.analyzedAt,

          source: req.file ? "image" : "text",

          extractedText: req.file ? extractedText : null,
        },
      },
    });

    // ----------------------------------------------------------
    // Send complete analysis back to frontend
    // ----------------------------------------------------------

    return res.status(201).json({
      id: opportunity.id,

      companyName: opportunity.companyName,

      contactEmail: opportunity.contactEmail,

      description: opportunity.description,

      extractedText: req.file ? extractedText : null,

      source: req.file ? "image" : "text",

      riskScore: analysis.riskScore,

      riskLevel: analysis.riskLevel,

      badge: analysis.badge,

      summary: analysis.summary,

      redFlags: analysis.redFlags,

      detectedSignals: analysis.detectedSignals,

      informationalSignals: analysis.informationalSignals,

      recommendations: analysis.recommendations,

      analyzedAt: analysis.analyzedAt,
    });
  } catch (error) {
    console.error("Opportunity analysis error:", error);

    return res.status(500).json({
      message: "Failed to analyze the opportunity.",
    });
  }
};
// ============================================================
// Get Opportunity History
// GET /api/opportunity/history
// ============================================================

export const getOpportunityHistory = async (req, res) => {
  try {
    const opportunities = await prisma.opportunityPosting.findMany({
      where: {
        userId: req.user.userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const history = opportunities.map((item) => {
      const details = item.analysisDetails || {};

      return {
        id: item.id,

        companyName: item.companyName,

        contactEmail: item.contactEmail,

        description: item.description,

        riskScore: item.riskScore,

        riskLevel: details.riskLevel || null,

        badge: details.badge || item.badge || null,

        summary: details.summary || "",

        redFlags: details.redFlags || [],

        detectedSignals: details.detectedSignals || [],

        informationalSignals: details.informationalSignals || [],

        recommendations: details.recommendations || [],

        createdAt: item.createdAt,
      };
    });

    return res.status(200).json(history);
  } catch (error) {
    console.error("Opportunity history error:", error);

    return res.status(500).json({
      message: "Failed to load opportunity history.",
    });
  }
};

// ============================================================
// Get Single Opportunity
// GET /api/opportunity/history/:id
// ============================================================

export const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    // ----------------------------------------------------------
    // Find opportunity belonging to current user
    // ----------------------------------------------------------

    const opportunity = await prisma.opportunityPosting.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    // ----------------------------------------------------------
    // Not found
    // ----------------------------------------------------------

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity analysis not found.",
      });
    }

    // ----------------------------------------------------------
    // Extract stored analysis details
    // ----------------------------------------------------------

    const details = opportunity.analysisDetails || {};

    // ----------------------------------------------------------
    // Return complete report
    // ----------------------------------------------------------

    return res.status(200).json({
      id: opportunity.id,

      companyName: opportunity.companyName,

      contactEmail: opportunity.contactEmail,

      description: opportunity.description,

      riskScore: opportunity.riskScore,

      riskLevel: details.riskLevel || null,

      badge: details.badge || opportunity.badge || null,

      summary: details.summary || "",

      redFlags: details.redFlags || [],

      detectedSignals: details.detectedSignals || [],

      informationalSignals: details.informationalSignals || [],

      recommendations: details.recommendations || [],

      createdAt: opportunity.createdAt,
    });
  } catch (error) {
    console.error("Opportunity detail error:", error);

    return res.status(500).json({
      message: "Failed to load opportunity analysis.",
    });
  }
};
