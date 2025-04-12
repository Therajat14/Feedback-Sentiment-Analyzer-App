import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/admin/feedbacks/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`api/admin/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      {feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        <ul>
          {feedbacks.map((feedback) => (
            <li
              key={feedback._id}
              className="mb-2 flex items-center justify-between rounded border p-3"
            >
              <div>
                <p>
                  <strong>Message:</strong> {feedback.message}
                </p>
                <p>
                  <strong>Sentiment:</strong> {feedback.sentimentLabel} (
                  {feedback.sentimentScore})
                </p>
              </div>
              <button
                onClick={() => handleDelete(feedback._id)}
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
