import Feedback from "../models/Feedback.js";

export const getAllFeedbacks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword = "",
      sentiment,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (keyword) {
      query.message = { $regex: keyword, $options: "i" };
    }

    if (sentiment) {
      query.sentimentLabel = sentiment;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const total = await Feedback.countDocuments(query);

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "name");

    res.json({
      feedbacks,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await Feedback.findByIdAndDelete(id);

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
    const dailyFeedback = {};
    const dailySentimentBreakdown = {};

    feedbacks.forEach((item) => {
      const sentiment = item.sentimentLabel;
      sentimentCounts[sentiment] += 1;

      const date = item.createdAt.toISOString().split("T")[0];

      dailyFeedback[date] = (dailyFeedback[date] || 0) + 1;

      if (!dailySentimentBreakdown[date]) {
        dailySentimentBreakdown[date] = {
          Positive: 0,
          Neutral: 0,
          Negative: 0,
        };
      }
      dailySentimentBreakdown[date][sentiment] += 1;
    });

    res.json({ sentimentCounts, dailyFeedback, dailySentimentBreakdown });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackTexts = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}, "text");
    const feedbackTexts = feedbacks.map((fb) => fb.text || "");
    res.json(feedbackTexts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
