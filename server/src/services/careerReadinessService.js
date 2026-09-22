import { roleRequirements } from "../data/roleRequirements.js";
const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const findRoleRequirements = (targetRole) => {
  if (!targetRole) {
    return null;
  }

  const normalizedRole = normalize(targetRole);

  const roleKey = Object.keys(roleRequirements).find(
    (role) => normalize(role) === normalizedRole,
  );

  if (!roleKey) {
    return null;
  }

  return {
    roleKey,
    requirements: roleRequirements[roleKey],
  };
};

export const calculateReadiness = (profile) => {
  const targetRole = profile.targetRole;

  const roleData = findRoleRequirements(targetRole);

  if (!roleData) {
    throw new Error(`Career role not found: ${targetRole}`);
  }

  const { roleKey, requirements } = roleData;

  /*
   * ------------------------------------------------------
   * Student's assessment data
   * ------------------------------------------------------
   *
   * Example:
   *
   * JavaScript -> level 5
   * React      -> level 4
   * Node.js    -> level 2
   */

  const assessments = profile.skillAssessments || [];

  const assessmentMap = new Map();

  assessments.forEach((assessment) => {
    assessmentMap.set(normalize(assessment.skillId), assessment);

    assessmentMap.set(normalize(assessment.skillName), assessment);
  });

  let totalWeight = 0;
  let earnedWeight = 0;

  const skillAnalysis = requirements.skills.map((requiredSkill) => {
    const skillId = normalize(requiredSkill.id);

    const skillName = normalize(requiredSkill.name);

    const assessment =
      assessmentMap.get(skillId) || assessmentMap.get(skillName);

    const level = Math.max(0, Math.min(5, Number(assessment?.level || 0)));

    const priority = assessment?.priority || "medium";

    /*
     * Level conversion:
     *
     * 0 = 0%
     * 1 = 20%
     * 2 = 40%
     * 3 = 60%
     * 4 = 80%
     * 5 = 100%
     */

    const skillPercentage = level / 5;

    const earned = requiredSkill.weight * skillPercentage;

    totalWeight += requiredSkill.weight;

    earnedWeight += earned;

    let status = "missing";

    if (level >= 4) {
      status = "covered";
    } else if (level > 0) {
      status = "developing";
    }

    return {
      skillId: requiredSkill.id,
      skillName: requiredSkill.name,
      category: requiredSkill.category,

      weight: requiredSkill.weight,

      level,

      priority,

      percentage: Math.round(skillPercentage * 100),

      status,
    };
  });

  const readiness =
    totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);

  const coveredSkills = skillAnalysis.filter(
    (skill) => skill.status === "covered",
  );

  const developingSkills = skillAnalysis.filter(
    (skill) => skill.status === "developing",
  );

  const missingSkills = skillAnalysis.filter(
    (skill) => skill.status === "missing",
  );

  /*
   * Skills requiring attention
   *
   * Level 0–3
   */

  const skillGaps = skillAnalysis
    .filter((skill) => skill.level < 4)
    .sort((a, b) => {
      /*
       * First prioritize lower skill levels.
       */
      if (a.level !== b.level) {
        return a.level - b.level;
      }

      /*
       * Then prioritize high-weight skills.
       */
      return b.weight - a.weight;
    });

  return {
    targetRole: roleKey,

    category: requirements.category,

    readiness,

    totalSkills: skillAnalysis.length,

    coveredCount: coveredSkills.length,

    developingCount: developingSkills.length,

    missingCount: missingSkills.length,

    assessedCount: skillAnalysis.filter((skill) => skill.level > 0).length,

    skills: skillAnalysis,

    coveredSkills,

    developingSkills,

    missingSkills,

    skillGaps,
  };
};
