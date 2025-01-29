import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Register_2 from "./components/Register_2";
import Dashboard from "./components/Dashboard";
import Dashboard_2 from "./components/Dashboard_2";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";
import JobAds from "./components/JobAds";
import AllJobsAd from "./components/AllJobsAd";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
     <Navbar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/skills" element={<Register_2 />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
        <Route
          path="/job-ads" element={
            <ProtectedRoute>
              <JobAds />
            </ProtectedRoute>}/>
        <Route
          path="/all-job-ads" element={
            <ProtectedRoute>
              <AllJobsAd />
            </ProtectedRoute>} />
        <Route
          path="/dashboard_2" element={
            <ProtectedRoute>
              <Dashboard_2 />
            </ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;

