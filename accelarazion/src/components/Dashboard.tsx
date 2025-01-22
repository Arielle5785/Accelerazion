import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/auth`, {
          withCredentials: true,
        });
        setUserData(response.data.user); // Assuming the backend sends user data
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login if unauthorized
      }
    };

    // Fetch skills data
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/user-skills`);
        setSkills(response.data.skills); // Assuming backend sends an array of skills
      } catch (error) {
        console.error("Error fetching user skills:", error);
      }
    };

    fetchUserData();
    fetchSkills();
  }, []);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {userData.firstName}!</h1>
      <h2>Your Details</h2>
      <p>Email: {userData.email}</p>
      <p>Current Country: {userData.currentCountry}</p>

      <h2>Your Skills</h2>
      {skills.length > 0 ? (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>{skill.skill_name}</li>
          ))}
        </ul>
      ) : (
        <p>No skills added yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
