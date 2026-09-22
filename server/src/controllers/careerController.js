import prisma from "../config/prisma.js";

import { roleRequirements } from "../data/roleRequirements.js";
import { generateRoadmap } from "../services/roadmapService.js";
import { calculateReadiness } from "../services/careerReadinessService.js";

// =====================================================
// HELPERS
// =====================================================

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const findRoleKey = (targetRole) => {
  const normalizedRole = normalize(targetRole);

  return Object.keys(roleRequirements).find(
    (role) => normalize(role) === normalizedRole,
  );
};

// =====================================================
// GET MY ASSESSMENT
// =====================================================

export const getMyAssessment = async (req, res) => {
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

    // No profile yet
    if (!profile) {
      return res.status(200).json({
        profile: null,
      });
    }

    const assessments = profile.skillAssessments || [];

    /*
     * Calculate readiness from the student's
     * selected skills/profile.
     */
    let readiness = 0;

    try {
      if (profile.targetRole) {
        const result = calculateReadiness(profile);

        readiness = result.readiness;
      }
    } catch (error) {
      console.log("Readiness calculation skipped:", error.message);
    }

    return res.status(200).json({
      profile: {
        ...profile,

        // Keep frontend-compatible name
        assessments,

        readiness,
      },
    });
  } catch (error) {
    console.error("GET ASSESSMENT ERROR:", error);

    return res.status(500).json({
      message: "Unable to fetch career assessment.",
    });
  }
};

// =====================================================
// SAVE ASSESSMENT
// =====================================================

export const saveAssessment = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { targetRole, assessments } = req.body;

    // --------------------------------------------------
    // Validate target role
    // --------------------------------------------------

    if (!targetRole || typeof targetRole !== "string" || !targetRole.trim()) {
      return res.status(400).json({
        message: "A valid target role is required.",
      });
    }

    // --------------------------------------------------
    // Validate role against our role requirements
    // --------------------------------------------------

    const roleKey = findRoleKey(targetRole);

    if (!roleKey) {
      return res.status(400).json({
        message: `Invalid target role: ${targetRole}`,
        availableRoles: Object.keys(roleRequirements),
      });
    }

    // --------------------------------------------------
    // Validate assessments
    // --------------------------------------------------

    if (!Array.isArray(assessments)) {
      return res.status(400).json({
        message: "Assessment data must be an array.",
      });
    }

    // --------------------------------------------------
    // Find career profile
    // --------------------------------------------------

    const existingProfile = await prisma.careerProfile.findUnique({
      where: {
        userId,
      },
    });

    let profile;

    if (existingProfile) {
      profile = await prisma.careerProfile.update({
        where: {
          userId,
        },

        data: {
          targetRole: roleKey,
          domain: roleRequirements[roleKey].category,

          /*
           * Store skill names in the profile.
           *
           * This is also used by the readiness
           * rules engine.
           */
          skills: assessments
            .filter((item) => Number(item.level || 0) > 0)
            .map((item) => item.skillName),
        },
      });
    } else {
      profile = await prisma.careerProfile.create({
        data: {
          userId,

          targetRole: roleKey,

          domain: roleRequirements[roleKey].category,

          skills: assessments
            .filter((item) => Number(item.level || 0) > 0)
            .map((item) => item.skillName),
        },
      });
    }

    // --------------------------------------------------
    // Save individual skill assessments
    // --------------------------------------------------

    for (const item of assessments) {
      if (!item.skillId) {
        continue;
      }

      await prisma.skillAssessment.upsert({
        where: {
          careerProfileId_skillId: {
            careerProfileId: profile.id,

            skillId: item.skillId,
          },
        },

        update: {
          skillName: item.skillName || "",

          category: item.category || "General",

          level: Number(item.level || 0),

          priority: item.priority || "medium",
        },

        create: {
          careerProfileId: profile.id,

          skillId: item.skillId,

          skillName: item.skillName || "",

          category: item.category || "General",

          level: Number(item.level || 0),

          priority: item.priority || "medium",
        },
      });
    }

    // --------------------------------------------------
    // Get updated profile
    // --------------------------------------------------

    const updatedProfile = await prisma.careerProfile.findUnique({
      where: {
        userId,
      },

      include: {
        skillAssessments: true,
      },
    });

    // --------------------------------------------------
    // Calculate readiness
    // --------------------------------------------------

    let readinessResult = null;

    try {
      readinessResult = calculateReadiness(updatedProfile);
    } catch (error) {
      console.error("READINESS CALCULATION ERROR:", error);
    }

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(200).json({
      message: "Career assessment saved successfully.",

      profile: {
        ...updatedProfile,

        assessments: updatedProfile.skillAssessments,

        readiness: readinessResult?.readiness || 0,
      },

      readiness: readinessResult,
    });
  } catch (error) {
    console.error("SAVE ASSESSMENT ERROR:", error);

    return res.status(500).json({
      message: "Unable to save career assessment.",
    });
  }
};

// =====================================================
// GET CAREER READINESS
// =====================================================

export const getCareerReadiness = async (req, res) => {
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

    if (!profile) {
      return res.status(404).json({
        message: "Please complete your career profile first.",
      });
    }

    if (!profile.targetRole) {
      return res.status(400).json({
        message: "Please select a target role first.",
      });
    }

    const result = calculateReadiness(profile);

    return res.status(200).json(result);
  } catch (error) {
    console.error("CAREER READINESS ERROR:", error);

    return res.status(500).json({
      message: "Unable to calculate career readiness.",
    });
  }
};

// =====================================================
// GET ROLE SKILLS
// =====================================================

export const getRoleSkills = async (req, res) => {
  try {
    const requestedRole = decodeURIComponent(req.params.role);

    const roleKey = findRoleKey(requestedRole);

    if (!roleKey) {
      return res.status(404).json({
        message: `Career role not found: ${requestedRole}`,

        availableRoles: Object.keys(roleRequirements),
      });
    }

    const requirements = roleRequirements[roleKey];

    return res.status(200).json({
      role: roleKey,

      category: requirements.category,

      skills: requirements.skills,
    });
  } catch (error) {
    console.error("GET ROLE SKILLS ERROR:", error);

    return res.status(500).json({
      message: "Unable to fetch role skills.",
    });
  }
};

export const getCareerRoadmap = async (req, res) => {
  try {
    const profile = await prisma.careerProfile.findUnique({
      where: {
        userId: req.user.userId,
      },
      include: {
        skillAssessments: true,
      },
    });

    if (!profile || !profile.targetRole) {
      return res.status(200).json({
        targetRole: null,
        roadmap: [],
        message: "Complete your career profile and skill assessment first.",
      });
    }

    const readiness = calculateReadiness(profile);

    const roadmap = generateRoadmap(readiness);

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error("Get career roadmap error:", error);

    return res.status(500).json({
      message: "Failed to generate career roadmap.",
    });
  }
};
