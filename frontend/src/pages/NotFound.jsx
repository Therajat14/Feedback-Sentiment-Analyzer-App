import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 px-4 text-gray-200">
      <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="mb-2 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-6 text-center text-lg text-gray-400">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
      >
        ⬅️ Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
