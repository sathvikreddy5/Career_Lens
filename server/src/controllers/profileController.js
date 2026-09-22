import prisma from "../config/prisma.js";

// =====================================================
// GET CAREER PROFILE
// =====================================================

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await prisma.careerProfile.findUnique({
      where: {
        userId,
      },
      include: {
        skillAssessments: true,
      },
    });

    return res.status(200).json({
      profile,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Unable to fetch career profile.",
    });
  }
};

// =====================================================
// CREATE / UPDATE CAREER PROFILE
// =====================================================

export const saveProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      college,
      branch,
      year,
      targetRole,
      domain,
      skills,
      githubUrl,
      linkedinUrl,
      leetcodeUrl,
    } = req.body;

    // ---------------------------------------------
    // Basic validation
    // ---------------------------------------------

    if (!targetRole) {
      return res.status(400).json({
        message: "Target role is required.",
      });
    }

    if (!domain) {
      return res.status(400).json({
        message: "Domain is required.",
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        message: "Please select at least one skill.",
      });
    }

    // ---------------------------------------------
    // Create or update profile
    // ---------------------------------------------

    const profile = await prisma.careerProfile.upsert({
      where: {
        userId,
      },

      update: {
        college: college?.trim() || null,
        branch: branch?.trim() || null,
        year: year || null,

        targetRole: targetRole.trim(),
        domain: domain.trim(),

        skills,

        githubUrl: githubUrl?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
        leetcodeUrl: leetcodeUrl?.trim() || null,
      },

      create: {
        userId,

        college: college?.trim() || null,
        branch: branch?.trim() || null,
        year: year || null,

        targetRole: targetRole.trim(),
        domain: domain.trim(),

        skills,

        githubUrl: githubUrl?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
        leetcodeUrl: leetcodeUrl?.trim() || null,
      },
    });

    return res.status(200).json({
      message: "Career profile saved successfully.",
      profile,
    });
  } catch (error) {
    console.error("SAVE PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Unable to save career profile.",
    });
  }
};
