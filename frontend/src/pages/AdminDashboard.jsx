import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

dayjs.extend(relativeTime);

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
      setFeedbacks(response.data.feedbacks);
      setPage(response.data.page);
      setPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("api/admin/feedback-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  const exportPDF = async () => {
    const doc = new jsPDF();
    const feedbackElement = document.getElementById("feedback-list");

    if (feedbackElement) {
      const canvas = await html2canvas(feedbackElement);
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    doc.save("feedback-report.pdf");
  };

  // Emoji from sentiment score
  const getEmotion = (score) => {
    if (score > 4) return "😊";
    if (score > 0) return "🙂";
    if (score === 0) return "😐";
    if (score > -2) return "😟";
    return "😠";
  };

  // Background color from sentiment label
  const getBackgroundColor = (label) => {
    switch (label.toLowerCase()) {
      case "positive":
        return "bg-green-400/20";
      case "negative":
        return "bg-red-400/20";
      case "neutral":
        return "bg-gray-400/10";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Admin Dashboard</h1>

        {stats && (
          <div
            className="mb-10 flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-gray-800 p-6 shadow-lg"
            id="chart-container"
          >
            <PieChart width={300} height={200}>
              <Pie
                data={[
                  { name: "Positive", value: stats.sentimentCounts.Positive },
                  { name: "Neutral", value: stats.sentimentCounts.Neutral },
                  { name: "Negative", value: stats.sentimentCounts.Negative },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
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
              width={500}
              height={250}
              data={Object.entries(stats.dailyFeedback).map(
                ([date, count]) => ({
                  date,
                  count,
                }),
              )}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Feedbacks</h2>
          <button
            onClick={exportPDF}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            Export as PDF
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search feedback..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

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
                    <button
                      onClick={() => handleDelete(fb._id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ul>
        )}

        <div className="mt-6 flex items-center justify-center space-x-2">
          {Array.from({ length: pages }, (_, i) => {
            const pageNum = i + 1;

            const isHidden =
              pages > 7 &&
              pageNum !== 1 &&
              pageNum !== pages &&
              Math.abs(pageNum - page) > 1;

            const isEllipsis =
              pages > 7 &&
              (pageNum === page - 2 || pageNum === page + 2) &&
              pageNum !== 1 &&
              pageNum !== pages;

            if (isEllipsis) {
              return (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            if (isHidden) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`rounded px-3 py-1 text-sm font-medium transition ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
