import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token); // ✅ store JWT
      alert("Login successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full border p-2"
      />
      <button type="submit" className="bg-green-500 px-4 py-2 text-white">
        Login
      </button>
    </form>
  );
}

export default Login;
