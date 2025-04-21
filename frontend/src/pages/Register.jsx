import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/auth/register", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-md"
      >
        <h2 className="text-center text-3xl font-bold text-white">
          Create Your Account
        </h2>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-95"
        >
          Register
        </button>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-blue-400 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
