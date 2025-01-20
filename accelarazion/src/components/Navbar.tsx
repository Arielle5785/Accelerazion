import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/useAuth";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post(
        `${apiBaseUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav>
      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/">Home</Link>
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
