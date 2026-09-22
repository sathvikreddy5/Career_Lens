import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { analyzeOpportunity } from "../controllers/safetyController.js";

import {
  getSafetyHistory,
  getSafetyHistoryItem,
} from "../controllers/safetyHistoryController.js";

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeOpportunity);

router.get("/history", authMiddleware, getSafetyHistory);

router.get("/history/:id", authMiddleware, getSafetyHistoryItem);

export default router;
