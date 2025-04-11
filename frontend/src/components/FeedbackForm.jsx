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
      ); // 👈 clean and short
      alert("Feedback submitted successfully!");
      setMessage(""); // clear the input
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full rounded border p-2"
        rows="4"
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
