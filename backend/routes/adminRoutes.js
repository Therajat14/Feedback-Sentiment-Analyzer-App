// routes/admin.js
import express from "express";
import {
  getAllFeedbacks,
  deleteFeedback,
  getFeedbackStats,
  getFeedbackTexts,
} from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/feedbacks", authenticate, isAdmin, getAllFeedbacks);
router.delete("/feedbacks/:id", authenticate, isAdmin, deleteFeedback);
router.get("/feedback-stats", authenticate, isAdmin, getFeedbackStats);
router.get("/admin/feedback-texts", authenticate, getFeedbackTexts);

export default router;
