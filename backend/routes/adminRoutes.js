// routes/admin.js
import express from "express";
import {
  getAllFeedbacks,
  deleteFeedback,
} from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/feedbacks", authenticate, isAdmin, getAllFeedbacks);
router.delete("/feedbacks/:id", authenticate, isAdmin, deleteFeedback);

export default router;
