import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router"; // ✅ Fix router import
import { Toaster, toast } from "react-hot-toast"; // ✅ Toast import

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      console.log(res.data);

      // ✅ Success toast with user's name (optional)
      toast.success(`Welcome back, ${res.data.name || "User"}! 🎉`);
      navigate("/");
    } catch (error) {
      // ❌ Error toast with fallback message
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      {/* ✅ Pattern Background */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* 🔥 Your form below stays the same */}
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-sm space-y-6 rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-md"
      >
        <h2 className="text-center text-3xl font-bold text-white">
          Welcome Back 👋
        </h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 transition focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 transition focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-500 active:scale-95"
        >
          🚀 Login
        </button>
        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
