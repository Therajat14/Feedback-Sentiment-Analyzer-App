import Feedback from "../models/Feedback.js";
import Sentiment from "sentiment";
import { sendEmail } from "../utils/email.js";
import User from "../models/User.js";

const sentiment = new Sentiment();

export const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;
    const result = sentiment.analyze(message);
    const sentimentScore = result.score;

    let sentimentLabel = "Neutral";
    if (sentimentScore > 0) sentimentLabel = "Positive";
    else if (sentimentScore < 0) sentimentLabel = "Negative";

    const user = await User.findById(userId);

    if (user) {
      await sendEmail(
        user.email,
        "Thank you for your feedback!",
        "We appreciate your valuable feedback."
      );
    }
    const feedback = new Feedback({
      userId: req.userId,
      message,
      sentimentScore,
      sentimentLabel,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.userId;

    const feedbacks = await Feedback.find({ userId })
      .sort({
        createdAt: -1,
      })
      .populate("userId", "name");

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server Error while fetching feedbacks" });
  }
};
