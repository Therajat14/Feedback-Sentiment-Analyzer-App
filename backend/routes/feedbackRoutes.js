import express from "express";
import {
  submitFeedback,
  getUserFeedbacks,
} from "../controllers/feedbackController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, submitFeedback);
router.get("/user", authenticate, getUserFeedbacks);

export default router;
