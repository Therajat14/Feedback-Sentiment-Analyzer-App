import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const { message, sentimentScore } = req.body;

    const feedback = new Feedback({
      userId: req.userId,
      message,
      sentimentScore,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
