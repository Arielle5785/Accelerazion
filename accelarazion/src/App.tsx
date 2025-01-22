import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Login from "./components/Login";
import Register from "./components/Register";
import Register_2 from "./components/Register_2";
import AllJobsAd from "./components/AllJobsAd";
import JobAds from "./components/JobAds";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import "./App.css";


const App: React.FC = () => {
  return (
    <>
      <div className="app">
        <Navbar />
        <UserProfile />
        <main className="container">
          <Routes>
            <Route path="/" element={<h2>Welcome to AcceleraZion</h2>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/skills" element={<Register_2 />} />
            <Route path="/all-jobs-ad" element={<AllJobsAd />} />
            <Route path="/job-ads" element={<JobAds />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                    <UserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
