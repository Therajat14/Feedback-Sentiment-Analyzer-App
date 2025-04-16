import { useEffect, useState } from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-700 bg-gray-900/80 p-6 shadow-xl backdrop-blur-lg lg:block">
        <div className="mb-8 text-center">
          <div className="text-xl font-bold text-white">
            👤 Welcome, {username || "User"}
          </div>
          <p className="text-sm text-gray-400">Glad you're here!</p>
        </div>

        <nav className="space-y-4">
          <a
            href="#"
            className="block rounded-md px-4 py-2 text-gray-300 transition hover:bg-blue-600 hover:text-white"
          >
            📝 Submit Feedback
          </a>
          <a
            href="#"
            className="block rounded-md px-4 py-2 text-gray-300 transition hover:bg-purple-600 hover:text-white"
          >
            📃 Your Feedback
          </a>
          <a
            href="#"
            className="block rounded-md px-4 py-2 text-gray-300 transition hover:bg-pink-600 hover:text-white"
          >
            📊 Sentiment Stats
          </a>
          <a
            href="/logout"
            className="block rounded-md px-4 py-2 text-red-500 transition hover:bg-red-600 hover:text-white"
          >
            🚪 Log Out
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-gray-700 bg-gray-900/80 px-6 py-4 shadow-md backdrop-blur-sm">
          <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
            Feedback & Sentiment Analyzer 🚀
          </h1>
        </header>

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl space-y-10">
            <FeedbackForm />
            <FeedbackList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
