import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./Pages/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Message from "./Pages/Message";
import LoginPage from "./Pages/Login";

const App = () => {
  const token = "avsduyqw"; // Example of token check

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="page-content">
          <Routes>
            {/* Protected Routes */}
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/users" element={token ? <Users /> : <Navigate to="/login" />} />
            <Route path="/message" element={token ? <Message /> : <Navigate to="/login" />} />

            {/* Login Page (For Unauthenticated Users) */}
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
