import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
    const navigate = useNavigate();
// console.log("userData :", userData);


  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/auth`, {
          withCredentials: true,
        });
        setUserData(response.data.user);
        return response.data.user;
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

    // Fetch languages data
    const fetchLanguages = async () => {
      try {
          const response = await axios.get(`${apiBaseUrl}/api/user-languages/${userData.userid}`);
          console.log(response.data);
          
          setLanguages(response.data); // Assuming backend sends an array of languages
      } catch (error) {
        console.error("Error fetching user languages:", error);
      }
      };
      
    //   console.log(languages);
      

  //   fetchUserData();
  //   fetchSkills();
  //   fetchLanguages();
  // }, []);

  // if (!userData) {
  //   return <p>Loading...</p>;
  // }
// Orchestrate data fetching
    const fetchData = async () => {
      const user = await fetchUserData();
      if (user?.userid) {
        await fetchSkills();
        await fetchLanguages();
      }
    };

    fetchData();
  }, [navigate]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>
        Welcome, {userData.firstName} {userData.lastName}!
      </h1>
      <h2>Your Details</h2>
      <p>Email: {userData.email}</p>
      <p>Current Country: {userData.currentCountry}</p>
      <p>Phone number: {userData.phoneCode} {userData.phoneNumber}</p>
      <p>Current Job Title: {userData.currentJobTitle} in Company:{" "}{userData.currentCompany}</p>
      <p>LinkedIn Profile: {userData.linkedinProfile} - GitHub Profile:{" "}{userData.githubProfile}</p>
      <p>You commit to make Alyah by {userData.deadline_date}</p>
      <p>You are looking for this kind of job in Israel: {userData.israelJob}</p>
      <p>You possess the following languages:{" "}
        {languages.map((language) => (
          <span key={language.id}>{language.language_name} </span>
        ))}
      </p>
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
