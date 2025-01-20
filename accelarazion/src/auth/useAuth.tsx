import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

// Define types for Auth Context
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  loading: boolean;
}

// Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (user: User, token: string): void => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", token);
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/user/auth`, {
        withCredentials: true,
      });
      const { user, token } = response.data;
      login(user, token);
    } catch (error) {
      console.error("Failed to refresh auth:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken && storedUser) {
        await refreshAuth();
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        refreshAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
