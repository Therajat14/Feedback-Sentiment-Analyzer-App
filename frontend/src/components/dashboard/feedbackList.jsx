import dayjs from "dayjs";
import api from "../../api/axios";
import { getEmotion, getBackgroundColor } from "../../../utils/sentimentUtils";

export function FeedbackList1({ feedbacks, isFromAdmin }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`api/admin/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div>
      {feedbacks.length === 0 ? (
        <p className="text-gray-400">No feedbacks found.</p>
      ) : (
        <ul id="feedback-list" className="space-y-4">
          <div id="feedback-list" className="space-y-6">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className={`hover:bg-opacity-30 relative rounded-lg p-6 shadow-lg transition-colors ${getBackgroundColor(
                  fb.sentimentLabel,
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getEmotion(fb.sentimentScore)}
                    </span>
                    <div>
                      <p className="font-medium text-white">{fb.message}</p>
                      <p className="text-sm text-gray-400">
                        Sentiment: {fb.sentimentLabel} (Score:{" "}
                        {fb.sentimentScore})
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(fb.createdAt).format("MMM D, YYYY h:mm A")}
                      </p>
                    </div>
                  </div>
                  {isFromAdmin && (
                    <button
                      onClick={() => handleDelete(fb._id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}
