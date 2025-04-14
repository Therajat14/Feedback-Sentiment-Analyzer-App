import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 px-4 py-10 text-white">
      <h1 className="mb-8 text-center text-3xl font-bold text-blue-400">
        Feedback & Sentiment Analyzer 🚀
      </h1>
      <div className="w-full max-w-2xl space-y-8">
        <FeedbackForm />
        <FeedbackList />
      </div>
    </div>
  );
};

export default Home;
