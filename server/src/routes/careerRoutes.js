import express from "express";

import {
  getMyAssessment,
  saveAssessment,
  getCareerReadiness,
  getRoleSkills,
  getCareerRoadmap,
} from "../controllers/careerController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Career Assessment
|--------------------------------------------------------------------------
*/

// Get the logged-in student's current skill assessment
router.get("/assessment", authMiddleware, getMyAssessment);

// Save / update the student's skill assessment
router.post("/assessment", authMiddleware, saveAssessment);

/*
|--------------------------------------------------------------------------
| Career Readiness
|--------------------------------------------------------------------------
*/

// Get calculated career readiness for the student's target role
router.get("/readiness", authMiddleware, getCareerReadiness);

/*
|--------------------------------------------------------------------------
| Role Skills
|--------------------------------------------------------------------------
*/

// Get required skills for a particular role
// Example:
// GET /api/career/roles/Backend%20Developer/skills
router.get("/roles/:role/skills", authMiddleware, getRoleSkills);

/*
|--------------------------------------------------------------------------
| Personalized Roadmap
|--------------------------------------------------------------------------
*/

// Generate a personalized learning roadmap
// based on the student's skill gaps
router.get("/roadmap", authMiddleware, getCareerRoadmap);

export default router;
