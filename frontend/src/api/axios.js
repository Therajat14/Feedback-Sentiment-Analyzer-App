import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 🔥 Adjust as per your backend
  //   withCredentials: true, // if you are using cookies/auth
});

export default instance;
