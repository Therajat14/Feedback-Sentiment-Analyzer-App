import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const FeedbackForm = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "api/feedback",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("🎉 Feedback submitted!");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong. Please try again.");
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
