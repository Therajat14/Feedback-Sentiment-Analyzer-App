import { useState, useEffect } from "react";
import api from "../../services/api";
import WordCloudChart from "./WordCloudChart";
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
    for (const [date, count] of Object.entries(stats.dailyFeedback)) {
      const month = new Date(date).toLocaleString("default", {
        year: "numeric",
        month: "short",
      });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + count;
    }

    return Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      count,
    }));
  };

  // New function: extract line chart data for all sentiments per month
  const getMonthlySentimentTrends = () => {
    const sentimentMap = {};

    for (const [date, sentimentCounts] of Object.entries(
      stats.dailySentimentBreakdown,
    )) {
      const month = new Date(date).toLocaleString("default", {
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

    // Sort by date and take last 12 months
    const sorted = Object.values(sentimentMap).sort((a, b) => {
      return new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`);
    });

    return sorted.slice(-12); // last 12 months
  };

  return (
    <>
      {stats && (
        <div
          className="mx-auto mb-10 flex w-full max-w-6xl flex-wrap items-center justify-center gap-10 rounded-2xl border border-gray-700 bg-gray-900/80 p-6 shadow-2xl backdrop-blur-lg"
          id="chart-container"
        >
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-300">
              Sentiment Distribution
            </h3>
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: "Positive", value: stats.sentimentCounts.Positive },
                  { name: "Neutral", value: stats.sentimentCounts.Neutral },
                  { name: "Negative", value: stats.sentimentCounts.Negative },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="mt-2 space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[0] }}
                ></span>
                Positive
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[1] }}
                ></span>
                Neutral
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[2] }}
                ></span>
                Negative
              </div>
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-300">
              Monthly Feedback Count
            </h3>
            <BarChart width={500} height={300} data={getMonthlyFeedback()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>

          {/* NEW: Sentiment Line Chart */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-300">
              Monthly Sentiment Trend (Last 12 Months)
            </h3>
            <LineChart
              width={600}
              height={300}
              data={getMonthlySentimentTrends()}
            >
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
          </div>
        </div>
      )}
    </>
  );
}

export default Chart;
