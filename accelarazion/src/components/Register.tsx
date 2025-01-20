import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL||"";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      // Register user
      console.log(username, password, email);
      
      await axios.post(
        `${apiBaseUrl}/api/user/register`,
        { username, password, email },
        { withCredentials: true }
      );

      // Log in user automatically
      const loginResponse = await axios.post(
        `${apiBaseUrl}/api/user/login`,
        { username, password, email  },
        { withCredentials: true }
      );

      const { user, token } = loginResponse.data;
      console.log({ user, token });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create Account</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
