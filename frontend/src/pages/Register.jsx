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
      const res = await axios.post("/auth/register", formData);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full border p-2"
      />
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
      <button type="submit" className="bg-blue-500 px-4 py-2 text-white">
        Register
      </button>
    </form>
  );
}

export default Register;
