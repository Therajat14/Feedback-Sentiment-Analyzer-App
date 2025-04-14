import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FeedbackList1 } from "../components/dashboard/feedbacklist";
import { Chart } from "../components/dashboard/charts";

dayjs.extend(relativeTime);

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAllFeedbacks();
  }, [page, keyword, sentiment, startDate, endDate]);

  const fetchAllFeedbacks = async () => {
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

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Admin Dashboard</h1>

        <Chart />

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

        <FeedbackList1
          feedbacks={feedbacks}
          isFromAdmin={true}
          fetchAllFeedbacks={fetchAllFeedbacks}
        />
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
