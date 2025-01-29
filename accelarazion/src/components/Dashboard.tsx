import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Dashboard = () => {
  const { user} = useAuth(); // Use useAuth for user data
  const [userFullData, setUserFullData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchUserFullData = async () => {
      try {
        console.log(`Fetching full data for user ID: ${user.userid}...`);
        const response = await axios.get(`${apiBaseUrl}/api/userFullData/${user.userid}`, {
          withCredentials: true,
        });
        setUserFullData(response.data);
      } catch (error) {
        console.error("Error fetching full user data:", error);
        navigate("/login"); // Redirect on error
      }
    };

    fetchUserFullData(); // Fetch full user data
  }, []);

  if (!userFullData) {
    return <p>Loading...</p>; // Show loading state while data is fetched
  }

  return (
    <div>
      <h1>
        Welcome, {userFullData.firstName} {userFullData.lastName}!
      </h1>
      <h2>Your Details</h2>
      <p>Email: {user?.email}</p>
      <p>Current Country: {userFullData.currentCountry}</p>
      <p>Phone number: {userFullData.phoneCode} {userFullData.phoneNumber}</p>
      <p>Current Job Title: {userFullData.currentJobTitle} in Company: {userFullData.currentCompany}</p>
      <p>LinkedIn Profile: {userFullData.linkedinProfile} - GitHub Profile: {userFullData.githubProfile}</p>
      <p>You commit to make Alyah by {userFullData.commitAlyah}</p>
      <p>You are a: {userFullData.userType}</p>
      <p>You are looking for this kind of job in Israel: {userFullData.israelJob}</p>
      <p>You possess the following languages:{" "}
        {userFullData.languages.map((language: any, index: number) => (
          <span key={`${language.language_id}-${index}`}>
            {language.language} ({language.level})
            {index < userFullData.languages.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <h2>Your Skills</h2>
      {userFullData.skills.length > 0 ? (
        <ul>
          {userFullData.skills.map((skill: any) => (
            <li key={skill.id}>{skill.skill_name} - {skill.category_skills}</li>
          ))}
        </ul>
      ) : (
        <p>No skills added yet.</p>
      )}
      <button type="button" onClick={() => navigate("/job-ads")}>Set up a new Job Ad</button>
    </div>
  );
};

export default Dashboard;

