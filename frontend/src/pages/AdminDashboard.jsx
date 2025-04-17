import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../api/axios";

import FeedbackList1 from "../components/dashboard/FeedbackList1";
import Chart from "../components/dashboard/Chart";
import LogoutButton from "../components/LogOut";

import { PDFDownloadLink } from "@react-pdf/renderer";
import FeedbackPDF from "../components/dashboard/FeedbackPDF";

dayjs.extend(relativeTime);

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("name");
    if (user) {
      setUsername(name);
    }
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
      console.log(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  return (
    <div className="flex h-screen w-full scroll-smooth bg-gray-950 text-white">
      {
        <aside className="hidden w-64 flex-shrink-0 flex-col rounded-tr-2xl rounded-br-2xl border-r border-gray-800 bg-gray-900/60 p-6 shadow-2xl backdrop-blur-md md:flex">
          <div className="mb-8 text-center">
            <div className="text-2xl font-extrabold tracking-wide text-white">
              Admin Panel
            </div>
            <p className="text-sm text-gray-400">
              Welcome, {username || "Admin"}
            </p>
          </div>

          <nav className="flex flex-col gap-4">
            <a
              href="#dashboard-overview"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-300 transition hover:bg-blue-600 hover:text-white"
            >
              📊 <span>Dashboard Overview</span>
            </a>
            <a
              href="#filters-section"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-300 transition hover:bg-purple-600 hover:text-white"
            >
              🧰 <span>Filters & Export</span>
            </a>
            <a
              href="#feedback-list-section"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-300 transition hover:bg-pink-600 hover:text-white"
            >
              📝 <span>Feedback List</span>
            </a>
            <a
              href="#pagination-section"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-300 transition hover:bg-green-600 hover:text-white"
            >
              🔢 <span>Pagination</span>
            </a>
          </nav>

          <div className="mt-auto pt-8">
            <LogoutButton />
          </div>
        </aside>
      }

      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        {/* Header (mobile-friendly) */}
        <header className="mb-6 flex flex-col justify-between gap-3 border-b border-gray-800 pb-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </header>

        {/* Charts */}
        <div id="dashboard-overview">
          <Chart />
        </div>

        {/* Filters + Export */}
        <div
          id="filters-section"
          className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-md md:flex-row md:items-center md:justify-between"
        >
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
            {feedbacks.length >= 1 && (
              <PDFDownloadLink
                document={<FeedbackPDF feedbacks={feedbacks} />}
                fileName="feedback-report.pdf"
              >
                {({ loading }) => (
                  <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Export PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Feedback List */}
        <div
          className="mt-6"
          id="feedback-list-section"
          style={{
            colorScheme: "light", // helps with consistent rendering
            color: "rgb(255,255,255)", // prevent oklab or hsl issues
          }}
        >
          <FeedbackList1
            feedbacks={feedbacks}
            isFromAdmin={true}
            fetchAllFeedbacks={fetchAllFeedbacks}
          />
        </div>

        {/* Pagination */}
        <div
          className="relative mt-8 flex flex-wrap justify-center gap-2"
          id="pagination-section"
        >
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
