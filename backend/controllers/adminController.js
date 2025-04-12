import Feedback from "../models/Feedback.js";

// ✅ Get all feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "", sentiment } = req.query;

    const query = {};

    // ✅ Search by keyword in 'message' field (case insensitive)
    if (keyword) {
      query.message = { $regex: keyword, $options: "i" };
    }

    // ✅ Filter by sentimentLabel (Positive, Negative, Neutral)
    if (sentiment) {
      query.sentimentLabel = sentiment;
    }

    const total = await Feedback.countDocuments(query);

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

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

// ✅ Delete specific feedback by ID
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
    console.log(feedbacks);

    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
    const dailyFeedback = {};

    feedbacks.forEach((item) => {
      sentimentCounts[item.sentimentLabel] += 1;

      const date = item.createdAt.toISOString().split("T")[0];
      dailyFeedback[date] = (dailyFeedback[date] || 0) + 1;
    });

    res.json({ sentimentCounts, dailyFeedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
