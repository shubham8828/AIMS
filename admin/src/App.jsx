import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./Pages/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Message from "./Pages/Message";
import LoginPage from "./Pages/Login";
import Profile from "./Pages/Profile";

const App = () => {
  const token = "b ashuqwjd"; // Retrieve token from localStorage or sessionStorage

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Show Sidebar only if authenticated */}
        {token && <Sidebar />}

        {/* Main Content */}
        <div className="page-content">
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/users"
              element={token ? <Users /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/message"
              element={token ? <Message /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={token ? <Profile /> : <Navigate to="/login" replace />}
            />

            {/* Login Page (For Unauthenticated Users) */}
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />

            {/* Fallback Route */}
            <Route
              path="*"
              element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
