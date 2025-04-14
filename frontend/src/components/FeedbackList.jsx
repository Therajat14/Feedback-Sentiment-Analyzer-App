import { useEffect, useState } from "react";
import api from "../api/axios";
import FeedbackList1 from "./dashboard/FeedbackList1";

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
    <div>
      <FeedbackList1 feedbacks={feedbacks} isFromAdmin={false} />
    </div>
    // <div className="mt-8 space-y-6">
    //   <h2 className="text-2xl font-semibold text-white">
    //     Your Feedback History
    //   </h2>
    //   {feedbacks.length === 0 ? (
    //     <p className="text-gray-400">No feedback found.</p>
    //   ) : (
    //     feedbacks.map((fb) => (
    //       <div
    //         key={fb._id}
    //         className={`hover:bg-opacity-30 rounded-lg p-6 shadow-lg transition-colors ${getBackgroundColor(
    //           fb.sentimentLabel,
    //         )}`}
    //       >
    //         <div className="flex items-center space-x-2">
    //           <span className="text-lg text-white">
    //             {getEmotion(fb.sentimentScore)}
    //           </span>
    //           <p className="font-medium text-white">{fb.message}</p>
    //         </div>
    //         <div className="mt-2">
    //           <p className="text-sm text-gray-400">
    //             Sentiment: {fb.sentimentLabel} (Score: {fb.sentimentScore})
    //           </p>
    //           <p className="text-xs text-gray-500">
    //             {new Date(fb.createdAt).toLocaleString()}
    //           </p>
    //         </div>
    //       </div>
    //     ))
    //   )}
    // </div>
  );
};

export default FeedbackList;
