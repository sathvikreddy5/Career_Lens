import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getPractice,
  getPracticeProgress,
  savePracticeProgress,
  getPracticeSummary,
  runPracticeTask,
} from "../controllers/practiceController.js";

const router = express.Router();

router.get("/", authMiddleware, getPractice);
router.get("/progress", authMiddleware, getPracticeProgress);
router.get("/summary", authMiddleware, getPracticeSummary);
router.post("/progress", authMiddleware, savePracticeProgress);
router.post("/run", authMiddleware, runPracticeTask);

export default router;
