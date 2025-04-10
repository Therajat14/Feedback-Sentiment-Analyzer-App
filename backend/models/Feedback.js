import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    sentimentScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
