import prisma from "../config/prisma.js";
import { calculateReadiness } from "../services/careerReadinessService.js";
import {
  getPracticeForSkills,
  resolvePracticeKey,
} from "../services/practiceService.js";
import { evaluateJavaScriptTask } from "../services/practiceEvaluatorService.js";
import { practiceResources } from "../data/practiceResources.js";
import { evaluateJavaTask } from "../services/javaPracticeEvaluatorService.js";
import { evaluatePythonTask } from "../services/pythonPracticeEvaluatorService.js";
import { evaluateSqlTask } from "../services/sqlPracticeEvaluatorService.js";
import { evaluateMongoTask } from "../services/mongoPracticeEvaluatorService.js";
import { evaluateGitTask } from "../services/gitPracticeEvaluatorService.js";

export const getPractice = async (req, res) => {
  try {
    const profile = await prisma.careerProfile.findUnique({
      where: {
        userId: req.user.userId,
      },
      include: {
        skillAssessments: true,
      },
    });

    if (!profile) {
      return res.status(400).json({
        message:
          "Please complete your career profile and skill assessment first.",
      });
    }

    const readiness = calculateReadiness(profile);

    const skillsToWorkOn = [
      ...(readiness.missingSkills || []),
      ...(readiness.developingSkills || []),
    ];

    const practice = getPracticeForSkills(skillsToWorkOn);

    return res.json({
      targetRole: readiness.targetRole,
      practice,
    });
  } catch (error) {
    console.error("Practice error:", error);

    return res.status(500).json({
      message: "Unable to load practice resources.",
    });
  }
};

export const runPracticeTask = async (req, res) => {
  try {
    const { skillId, taskId, code } = req.body;

    if (!skillId || !taskId) {
      return res.status(400).json({
        message: "Skill ID and task ID are required.",
      });
    }

    const resolvedSkillId = resolvePracticeKey({
      skillId,
    });

    const skillData = practiceResources[resolvedSkillId];

    if (!skillData) {
      return res.status(404).json({
        message: `Practice resources not found for skill: ${skillId}`,
      });
    }

    const task = skillData.practice?.find((item) => item.id === taskId);

    if (!task) {
      return res.status(404).json({
        message: `Practice task not found: ${taskId}`,
      });
    }

    let result;

    if (task.language === "javascript") {
      result = evaluateJavaScriptTask({
        code,
        task,
      });
    } else if (task.language === "java") {
      result = await evaluateJavaTask({
        code,
        task,
      });
    } else if (task.language === "python") {
      result = await evaluatePythonTask({
        code,
        task,
      });
    } else if (task.language === "sql") {
      result = await evaluateSqlTask({
        code,
        task,
      });
    } else if (task.language === "mongodb") {
      result = await evaluateMongoTask({
        code,
        task,
      });
    } else if (task.language === "git") {
      result = evaluateGitTask({
        code,
        task,
      });
    } else {
      return res.status(400).json({
        message: `The evaluator does not support ${task.language} tasks yet.`,
      });
    }

    return res.json({
      taskId,
      skillId: resolvedSkillId,
      ...result,
    });
  } catch (error) {
    console.error("Run practice task error:", error);

    return res.status(500).json({
      message: "Unable to evaluate the practice task.",
      error: error.message,
    });
  }
};

export const getPracticeProgress = async (req, res) => {
  try {
    const progress = await prisma.practiceProgress.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: [
        {
          skillId: "asc",
        },
        {
          taskIndex: "asc",
        },
      ],
    });

    return res.json({
      progress,
    });
  } catch (error) {
    console.error("Practice progress error:", error);

    return res.status(500).json({
      message: "Unable to load practice progress.",
    });
  }
};

export const getPracticeSummary = async (req, res) => {
  try {
    const progress = await prisma.practiceProgress.findMany({
      where: {
        userId: req.user.userId,
        completed: true,
      },
      orderBy: [
        {
          skillId: "asc",
        },
        {
          taskIndex: "asc",
        },
      ],
    });

    const summaryMap = {};

    progress.forEach((item) => {
      if (!summaryMap[item.skillId]) {
        summaryMap[item.skillId] = {
          skillId: item.skillId,
          completedTasks: 0,
          completedIndexes: [],
        };
      }

      summaryMap[item.skillId].completedTasks += 1;

      summaryMap[item.skillId].completedIndexes.push(item.taskIndex);
    });

    return res.json({
      summary: Object.values(summaryMap),
    });
  } catch (error) {
    console.error("Practice summary error:", error);

    return res.status(500).json({
      message: "Unable to load practice summary.",
    });
  }
};

export const savePracticeProgress = async (req, res) => {
  try {
    const { skillId, taskIndex, completed } = req.body;

    if (!skillId || taskIndex === undefined) {
      return res.status(400).json({
        message: "Skill ID and task index are required.",
      });
    }

    const numericTaskIndex = Number(taskIndex);

    if (
      Number.isNaN(numericTaskIndex) ||
      numericTaskIndex < 0 ||
      !Number.isInteger(numericTaskIndex)
    ) {
      return res.status(400).json({
        message: "Task index must be a valid non-negative integer.",
      });
    }

    const isCompleted = completed !== false;

    const progress = await prisma.practiceProgress.upsert({
      where: {
        userId_skillId_taskIndex: {
          userId: req.user.userId,
          skillId,
          taskIndex: numericTaskIndex,
        },
      },

      update: {
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },

      create: {
        userId: req.user.userId,
        skillId,
        taskIndex: numericTaskIndex,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return res.json({
      message: isCompleted
        ? "Practice task marked as completed."
        : "Practice task marked as incomplete.",

      progress,
    });
  } catch (error) {
    console.error("Save practice progress error:", error);

    return res.status(500).json({
      message: "Unable to save practice progress.",
    });
  }
};
