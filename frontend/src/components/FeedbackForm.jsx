import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // ✅ Import jwt-decode
import { useNavigate } from "react-router"; // ✅ Import navigate

const FeedbackForm = ({ reload, setReload }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      console.log(e);
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      toast.error("Session expired. Please log in again.");
      return navigate("/login");
    }

    try {
      await api.post(
        "api/feedback",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage("");
      setReload(!reload);
      toast.success("✅ Feedback submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to submit feedback. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-gray-700 bg-gray-900/80 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-blue-900/40"
    >
      <label
        htmlFor="feedback"
        className="block text-lg font-semibold text-gray-200"
      >
        Tell us what you think 💬
      </label>
      <textarea
        id="feedback"
        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows="4"
        placeholder="Your feedback helps us improve..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 active:scale-95"
      >
        🚀 Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
