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
      console.log(res);
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-gray-800 p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-white">
          Welcome Back 👋
        </h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-500"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="cursor-pointer text-green-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
