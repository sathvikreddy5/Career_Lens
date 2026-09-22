import { learningResources } from "../data/learningResources.js";

const normalize = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[.\s]+/g, "-");

export const generateRoadmap = (readiness) => {
  if (!readiness) {
    return {
      targetRole: null,
      roadmap: [],
    };
  }

  const roadmap = (readiness.skillGaps || []).map((gap, index) => {
    const resource =
      learningResources[gap.skillId] ||
      learningResources[normalize(gap.skillName)] ||
      null;

    return {
      order: index + 1,

      skillId: gap.skillId,

      skillName: gap.skillName,

      category: gap.category,

      currentLevel: gap.level,

      requiredLevel: 5,

      priority: gap.priority || "medium",

      weight: gap.weight,

      status: gap.status,

      reason:
        gap.level === 0
          ? `You haven't assessed yourself in ${gap.skillName} yet.`
          : `You are currently at level ${gap.level}/5 in ${gap.skillName}.`,

      description:
        resource?.description || `Improve your ${gap.skillName} skills.`,

      resources: resource?.resources || [],
    };
  });

  return {
    targetRole: readiness.targetRole,

    category: readiness.category,

    readiness: readiness.readiness,

    totalSkills: readiness.totalSkills,

    roadmap,
  };
};
