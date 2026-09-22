import { practiceResources } from "../data/practiceResources.js";

const normalize = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const aliases = {
  javascript: "javascript",
  js: "javascript",

  reactjs: "react",
  "react.js": "react",

  node: "node-js",
  "node.js": "node-js",

  express: "express-js",
  "express.js": "express-js",

  postgres: "postgresql",
  sql: "sql",

  aws: "aws",
  docker: "docker",
};

export const resolvePracticeKey = (skill) => {
  const rawSkillId = skill?.skillId || "";
  const rawSkillName = skill?.skillName || "";

  const normalizedId = normalize(rawSkillId);
  const normalizedName = normalize(rawSkillName);

  if (practiceResources[normalizedId]) {
    return normalizedId;
  }

  if (practiceResources[normalizedName]) {
    return normalizedName;
  }

  if (aliases[normalizedId]) {
    return aliases[normalizedId];
  }

  if (aliases[normalizedName]) {
    return aliases[normalizedName];
  }

  return normalizedId || normalizedName;
};

export const getPracticeForSkills = (skills = []) => {
  return skills.map((skill) => {
    const skillId = resolvePracticeKey(skill);

    const data = practiceResources[skillId];

    return {
      skillId,
      skillName: skill.skillName,
      category: skill.category,
      status: skill.status,
      practice: data?.practice || [],
      project: data?.project || null,
    };
  });
};
