// import api from "../api/axios";

// export const fetchStats = async () => {
//   try {
//     const res = await api.get("api/admin/feedback-stats", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     setStats(res.data);
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//   }
// };

// export const handleDelete = async (id) => {
//   try {
//     const token = localStorage.getItem("token");
//     await api.delete(`api/admin/feedbacks/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchFeedbacks();
//   } catch (error) {
//     console.error("Error deleting feedback:", error);
//   }
// };

// export const fetchFeedbacks = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await api.get("/api/admin/feedbacks/", {
//       params: { page, keyword, sentiment, startDate, endDate },
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setFeedbacks(response.data.feedbacks);
//     setPage(response.data.page);
//     setPages(response.data.pages);
//   } catch (error) {
//     console.error("Error fetching feedbacks:", error);
//   }
// };
