import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [stats, setStats] = useState(null);
  const COLORS = ["#4CAF50", "#9E9E9E", "#F44336"];

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, keyword, sentiment, startDate, endDate]);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/admin/feedbacks/", {
        params: { page, keyword, sentiment, startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(startDate, endDate);
      console.log(response.data);
      setFeedbacks(response.data.feedbacks);
      setPage(response.data.page);
      setPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchStats = async () => {
    const res = await api.get("api/admin/feedback-stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setStats(res.data);
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

      {stats && (
        <div className="justify-cente mb-5 flex flex-row items-center border-2 pr-5">
          <PieChart width={400} height={150}>
            <Pie
              data={[
                { name: "Positive", value: stats.sentimentCounts.Positive },
                { name: "Neutral", value: stats.sentimentCounts.Neutral },
                { name: "Negative", value: stats.sentimentCounts.Negative },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <BarChart
            width={600}
            height={300}
            data={Object.entries(stats.dailyFeedback).map(([date, count]) => ({
              date,
              count,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      )}

      <h1 className="blod mt-10 mb-5 text-2xl">Feedbacks</h1>
      <input
        type="text"
        placeholder="Search feedback..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
        <option value="">All Sentiments</option>
        <option value="Positive">Positive</option>
        <option value="Neutral">Neutral</option>
        <option value="Negative">Negative</option>
      </select>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

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
                <p>{dayjs(feedback.createdAt).fromNow()}</p>

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
      <div>
        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        {/* Numbered Buttons */}
        {Array.from({ length: pages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            style={{
              backgroundColor: page === index + 1 ? "lightblue" : "white",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
            className="mt-1 mr-1 w-10 text-gray-700"
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          disabled={page === pages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
