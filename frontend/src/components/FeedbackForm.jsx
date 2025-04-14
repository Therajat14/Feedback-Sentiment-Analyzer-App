import { useState } from "react";
import api from "../api/axios";

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
      alert("Feedback submitted successfully!");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-gray-800 p-6 shadow-md"
    >
      <textarea
        className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        rows="4"
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
