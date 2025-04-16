import dayjs from "dayjs";
import api from "../../api/axios";
import { getEmotion, getBackgroundColor } from "../../../utils/sentimentUtils";

function FeedbackList1({ feedbacks, isFromAdmin, fetchAllFeedbacks }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`api/admin/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 max-h-[500px] pr-2">
      {feedbacks.length === 0 ? (
        <p className="py-10 text-center text-gray-400">No feedbacks found.</p>
      ) : (
        <ul id="feedback-list" className="space-y-5">
          {feedbacks.map((fb) => (
            <li
              key={fb._id}
              className={`relative rounded-2xl border border-gray-700 bg-gray-800/80 p-6 shadow-md backdrop-blur-md transition-colors ${getBackgroundColor(
                fb.sentimentLabel,
              )}`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left side: emoji + info */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-3xl">
                    {getEmotion(fb.sentimentScore)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-base leading-snug font-medium text-white">
                      {fb.message}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white">
                        {fb.userId?.name?.[0] || "U"}
                      </div>
                      <span>{fb.userId?.name || "Unknown User"}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {dayjs(fb.createdAt).format("MMM D, YYYY h:mm A")}
                    </p>
                  </div>
                </div>

                {/* Delete button (if admin) */}
                {isFromAdmin && (
                  <button
                    onClick={() => handleDelete(fb._id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackList1;
