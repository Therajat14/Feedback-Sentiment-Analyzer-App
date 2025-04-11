import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const Home = () => {
  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Feedback & Sentiment Analyzer</h1>
      <FeedbackForm />
      <FeedbackList />
    </div>
  );
};

export default Home;
