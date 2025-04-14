import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const Home = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-10 text-white">
      {/* Decorative glowing circles */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 transform rounded-full bg-purple-500 opacity-30 blur-3xl"></div>
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 translate-x-1/3 translate-y-1/3 transform rounded-full bg-pink-500 opacity-20 blur-2xl"></div>

      <h1 className="mb-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-center text-4xl font-extrabold text-transparent drop-shadow-md">
        Feedback & Sentiment Analyzer 🚀
      </h1>

      <div className="z-10 w-full max-w-2xl space-y-10">
        <FeedbackForm />
        <FeedbackList />
      </div>
    </div>
  );
};

export default Home;
