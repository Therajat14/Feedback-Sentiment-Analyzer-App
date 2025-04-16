import { useState, useEffect } from "react";
import api from "../../services/api";
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
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

function Chart() {
  const [stats, setStats] = useState(null);
  const COLORS = ["#4CAF50", "#9E9E9E", "#F44336"];

  useEffect(() => {
    fetchStats();
  }, []);

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

  const getMonthlyFeedback = () => {
    const monthlyCounts = {};
    const now = new Date();
    const aYearAgo = new Date(now.getFullYear() - 1, now.getMonth());

    for (const [date, count] of Object.entries(stats.dailyFeedback)) {
      const parsedDate = new Date(date);
      if (parsedDate >= aYearAgo) {
        const month = parsedDate.toLocaleString("default", {
          year: "numeric",
          month: "short",
        });
        monthlyCounts[month] = (monthlyCounts[month] || 0) + count;
      }
    }

    return Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      count,
    }));
  };

  const getMonthlySentimentTrends = () => {
    const sentimentMap = {};
    const now = new Date();
    const aYearAgo = new Date(now.getFullYear() - 1, now.getMonth());

    for (const [date, sentimentCounts] of Object.entries(
      stats.dailySentimentBreakdown,
    )) {
      const parsedDate = new Date(date);
      if (parsedDate >= aYearAgo) {
        const month = parsedDate.toLocaleString("default", {
          year: "numeric",
          month: "short",
        });

        if (!sentimentMap[month]) {
          sentimentMap[month] = {
            month,
            Positive: 0,
            Neutral: 0,
            Negative: 0,
          };
        }

        sentimentMap[month].Positive += sentimentCounts.Positive || 0;
        sentimentMap[month].Neutral += sentimentCounts.Neutral || 0;
        sentimentMap[month].Negative += sentimentCounts.Negative || 0;
      }
    }

    return Object.values(sentimentMap).sort(
      (a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`),
    );
  };

  return (
    <>
      {stats && (
        <div
          className="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 md:px-8"
          id="chart-container"
        >
          {/* Pie Chart */}
          <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 shadow-lg backdrop-blur-md">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-300">
              Sentiment Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Positive",
                        value: stats.sentimentCounts.Positive,
                      },
                      { name: "Neutral", value: stats.sentimentCounts.Neutral },
                      {
                        name: "Negative",
                        value: stats.sentimentCounts.Negative,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center gap-4 text-sm text-gray-300">
                {["Positive", "Neutral", "Negative"].map((label, idx) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    ></span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 shadow-lg backdrop-blur-md">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-300">
              Monthly Feedback Count (Last 12 Months)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={getMonthlyFeedback()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 shadow-lg backdrop-blur-md">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-300">
              Monthly Sentiment Trend (Last 12 Months)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={getMonthlySentimentTrends()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Positive"
                    stroke="#4CAF50"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Neutral"
                    stroke="#9E9E9E"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Negative"
                    stroke="#F44336"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chart;
