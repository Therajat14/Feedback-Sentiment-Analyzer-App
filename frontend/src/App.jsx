import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
