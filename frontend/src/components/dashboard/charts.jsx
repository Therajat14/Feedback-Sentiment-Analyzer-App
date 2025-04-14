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
} from "recharts";
export function Chart() {
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
  return (
    <>
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
            data={Object.entries(stats.dailyFeedback).map(([date, count]) => ({
              date,
              count,
            }))}
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
    </>
  );
}
