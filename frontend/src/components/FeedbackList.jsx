import { useEffect, useState } from "react";
import api from "../api/axios";

// Emojis based on sentiment score ranges
const getEmotion = (score) => {
  if (score > 4) return "😊"; // Very happy
  if (score > 0) return "🙂"; // Happy
  if (score === 0) return "😐"; // Neutral
  if (score > -2) return "😟"; // Sad
  return "😠"; // Angry
};

// Get background color based on sentiment label
const getBackgroundColor = (label) => {
  switch (label.toLowerCase()) {
    case "positive":
      return "bg-green-400/20"; // Soft green with opacity
    case "negative":
      return "bg-red-400/20"; // Soft red with opacity
    case "neutral":
      return "bg-gray-400/10"; // Light gray
    default:
      return "bg-gray-800"; // Default dark background
  }
};

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/api/feedback/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Your Feedback History
      </h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-400">No feedback found.</p>
      ) : (
        feedbacks.map((fb) => (
          <div
            key={fb._id}
            className={`hover:bg-opacity-30 rounded-lg p-6 shadow-lg transition-colors ${getBackgroundColor(
              fb.sentimentLabel,
            )}`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg text-white">
                {getEmotion(fb.sentimentScore)}
              </span>
              <p className="font-medium text-white">{fb.message}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                Sentiment: {fb.sentimentLabel} (Score: {fb.sentimentScore})
              </p>
              <p className="text-xs text-gray-500">
                {new Date(fb.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackList;
