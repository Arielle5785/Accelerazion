import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/useAuth";
import logo from "../assets/logo.png";
import "../App.css";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post(`${apiBaseUrl}/api/logout`, {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <img
        src={logo}
        alt="Accelerazion Logo"
        className="logo"
        onClick={() => navigate("/")} // Using `navigate` instead of window.location for SPA navigation
      />

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link to="/">Home</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;


// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../auth/useAuth";
// import logo from "../assets/logo.png";

// const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const { logout, isAuthenticated } = useAuth();

//   const handleLogout = async (): Promise<void> => {
//     try {
//       await axios.post(
//         `${apiBaseUrl}/api/logout`,
//         {},
//         { withCredentials: true }
//       );
//       logout();
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <nav>
//       <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
//       {/* Logo */}
//       <img src={logo} alt="Accelerazion Logo" className="h-10" />

//       {/* Navigation Links */}
//         <Link to="/">Home</Link>
//         {!isAuthenticated && (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//             {/* <Link to="/register/skills">Register Skills</Link> */}
//             {/* <Link to="/all-job-ads">All Jobs Ad</Link> */}
//             {/* <Link to="/job-ads">Job Ad</Link> */}
//           </>
//         )}
//         {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
//         {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

