import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router";

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
      alert("✅ Login successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-md"
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
