import Feedback from "../models/Feedback.js";
import Sentiment from "sentiment";
const sentiment = new Sentiment();

export const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    const result = sentiment.analyze(message);
    const sentimentScore = result.score;

    let sentimentLabel = "Neutral";
    if (sentimentScore > 0) sentimentLabel = "Positive";
    else if (sentimentScore < 0) sentimentLabel = "Negative";

    console.log({
      result,
      sentimentLabel,
    });

    const feedback = new Feedback({
      userId: req.userId,
      message,
      sentimentScore,
      sentimentLabel,
    });

    console.log(feedback);

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId); // prints 67f9103e20311c9b98ada29e
    const feedbacks = await Feedback.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server Error while fetching feedbacks" });
  }
};
