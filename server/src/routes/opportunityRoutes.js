import express from "express";

import {
  analyzeOpportunityPost,
  getOpportunityHistory,
  getOpportunityById,
} from "../controllers/opportunityController.js";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  upload.single("image"),
  analyzeOpportunityPost,
);
router.get("/history", authMiddleware, getOpportunityHistory);

router.get("/history/:id", authMiddleware, getOpportunityById);

export default router;
