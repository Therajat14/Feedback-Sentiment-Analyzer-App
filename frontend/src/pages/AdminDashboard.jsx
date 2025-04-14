import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FeedbackList1 } from "../components/dashboard/FeedbackList1";
import { Chart } from "../components/dashboard/Charts";
import LogoutButton from "../components/LogoutButton";

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
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Charts */}
        <Chart />

        {/* Filters + Export */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Feedbacks</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search feedback..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className="rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={exportPDF}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <FeedbackList1
          feedbacks={feedbacks}
          isFromAdmin={true}
          fetchAllFeedbacks={fetchAllFeedbacks}
        />

        {/* Pagination */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
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
                <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            if (isHidden) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
