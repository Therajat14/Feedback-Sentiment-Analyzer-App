import { useEffect, useState } from "react";
import api from "../api/axios";

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
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Your Feedback History</h2>
      {feedbacks.map((fb) => (
        <div key={fb._id} className="rounded border p-3 shadow">
          <p className="text-gray-800">{fb.message}</p>
          <p className="text-sm text-gray-500">
            Sentiment: {fb.sentimentLabel} (Score: {fb.sentimentScore})
          </p>
          <p className="text-xs text-gray-400">
            {new Date(fb.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
