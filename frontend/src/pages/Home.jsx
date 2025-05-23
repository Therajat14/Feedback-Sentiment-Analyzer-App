import { useEffect, useState } from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import LogoutButton from "../components/LogOut";
import { Link, useNavigate } from "react-router";

const Home = () => {
  const [username, setUsername] = useState("");
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUsername(name);
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-gray-700 bg-gray-900/80 px-6 py-4 shadow-md backdrop-blur-sm">
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="bg-clip-text text-2xl font-bold">Submit Feedback</h1>
            <Link
              to="/admin"
              onClick={(e) => {
                e.preventDefault(); // prevent default link behavior
                navigate("/admin"); // programmatic navigation
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Go to Admin
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl space-y-10">
            <FeedbackForm reload={reload} setReload={setReload} />
            <div className="flex flex-row justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h2 className="text-xl font-semibold">Feedback History</h2>
            </div>
            <FeedbackList reload={reload} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
