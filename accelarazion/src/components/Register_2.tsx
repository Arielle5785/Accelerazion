import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../auth/useAuth";
import "../App.css";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Register_2 :React.FC = () => {
  const user = useAuth();
  const navigate = useNavigate();

  // State for skills and selected skills
  const [skills, setSkills] = useState<Record<string, any[]> | null>(null); // Grouped by category
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

  // Fetch skills data
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/skills`);
        const groupedSkills = response.data.reduce((acc: any, skill: any) => {
          if (!acc[skill.category_skills]) {
            acc[skill.category_skills] = [];
          }
          acc[skill.category_skills].push(skill);
          return acc;
        }, {});
        setSkills(groupedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // Handle checkbox toggle
  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId) // Remove if already selected
        : [...prev, skillId] // Add if not selected
    );
  };

  // Save selected skills
  const handleSave = async () => {
    try {
      if (!user) {
        console.error("Invalid loggedInUser data:", user);
        alert("User not logged in.");
        return;
      
      }

      // Prepare payload
      const payload = {
        userId: user,
        skillIds: selectedSkills,
      };

      console.log("Payload being sent:", payload);

      // Send payload to backend
      await axios.post(`${apiBaseUrl}/api/register/skills`, payload, {
        withCredentials: true,
      });

      alert("Skills saved successfully!");
    } catch (error: any) {
      console.error("Error saving skills:", error.response?.data || error.message);
    }
  };

  return (
    <div className="skills-container">
      <div className="logo-container">
        <img src={logo} alt="Accelerazion Logo" className="logo" />
      </div>
      <h2 className="form-title">Select Your Skills</h2>
      <div className="skills-grid">
        {skills ? (
          Object.entries(skills).map(([category, skills]) => (
            <div key={category} className="category-card">
              <h3 className="category-title">{category}</h3>
              <div className="skills-list">
                {skills.map((skill: any) => (
                  <div key={skill.id} className="skill-item">
                    <label>
                      <input
                        type="checkbox"
                        value={skill.id}
                        onChange={() => handleSkillToggle(skill.id)}
                        checked={selectedSkills.includes(skill.id)}
                      />
                      {skill.skill_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Loading skills...</p>
        )}
      </div>
      <div className="form-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    </div>
  );
};

export default Register_2;



// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate} from "react-router-dom";
// import logo from "../assets/logo.png"
// import { useAuth } from "../auth/useAuth";
// import "../App.css"

// const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

// const Register_2: React.FC = () => {
//   // const [searchParams] = useSearchParams();// Get the userId from the query parameter
//   // const email = searchParams.get("email");
//   // const userId = searchParams.get("userId");
//   const navigate = useNavigate();

//     // State for skills and selected skills
//     const [skills, setSkills] = useState<Record<string, any[]> | null>(null); // Grouped by category
//     const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

//   // Fetch skills data
//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await axios.get(`${apiBaseUrl}/api/skills`);
//         const groupedSkills = response.data.reduce((acc: any, skill: any) => {
//           if (!acc[skill.category_skills]) {
//             acc[skill.category_skills] = [];
//           }
//           acc[skill.category_skills].push(skill);
//           return acc;
//         }, {});
//         setSkills(groupedSkills);
//       } catch (error) {
//         console.error("Error fetching skills:", error);
//       }
//     };

//     fetchSkills();
//   }, []);

//   // Handle checkbox toggle
//   const handleSkillToggle = (skillId: number) => {
//     setSelectedSkills((prev) =>
//       prev.includes(skillId)
//         ? prev.filter((id) => id !== skillId) // Remove if already selected
//         : [...prev, skillId] // Add if not selected
//     );
//   };

//   // Save selected skills
//   // const handleSave = async () => {
//   //   try {
//   //     await axios.post(`${apiBaseUrl}/api/user-skills`, {
//   //       userId,
//   //       skillIds: selectedSkills,
//   //     });
//   //     alert("Skills saved successfully!");
//   //     navigate("/dashboard");
//   //   } catch (error) {
//   //     console.error("Error saving skills:", error);
//   //   }
//     // };
// //     try {
// //       const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
// //       if (!loggedInUser.id || !loggedInUser.email) {
// //   console.error("Invalid loggedInUser data:", loggedInUser);
// // }
// //       const payload = { userId: loggedInUser.id, email: loggedInUser.email, skills: selectedSkills };
// //       // const payload = userId
// //         // ? { userId, skills }
// //       //   : { email, skills };

// //       await axios.post(`${apiBaseUrl}/api/register/skills`, payload, {
// //         withCredentials: true,
// //       });
// //       alert("Skills saved successfully!");
// //     } catch (err: any) {
// //       console.error(err.response?.data?.message || "Error saving skills");
//   //     }

//   const handleSave = async () => {
//   try {
//     const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

//     if (!loggedInUser.id) {
//       console.error("Invalid loggedInUser data:", loggedInUser);
//       alert("User not logged in.");
//       return;
//     }

//     const payload = {
//       userId: loggedInUser.id,
//       skillIds: selectedSkills,
//     };

//     console.log("Payload being sent:", payload);

//     await axios.post(`${apiBaseUrl}/api/register/skills`, payload, {
//       withCredentials: true,
//     });

//     alert("Skills saved successfully!");
//   } catch (error) {
//     console.error("Error saving skills:", error.response?.data || error.message);
//   }
// };
//   };

//   return (
//     <div className="skills-container">
//       <div className="logo-container">
//         <img src={logo} alt="Accelerazion Logo" className="logo" />
//       </div>
//       <h2 className="form-title">Select Your Skills</h2>
//       <div className="skills-grid">
//       {skills ? (
//         Object.entries(skills).map(([category, skills]) => (
//           <div key={category} className="category-card">
//             <h3 className="category-title">{category}</h3>
//             <div className="skills-list">
//               {skills.map((skill: any) => (
//                 <div key={skill.id} className="skill-item">
//                   <label>
//                     <input
//                       type="checkbox"
//                       value={skill.id}
//                       onChange={() => handleSkillToggle(skill.id)}
//                       checked={selectedSkills.includes(skill.id)}
//                     />
//                     {skill.skill_name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>Loading skills...</p>
//         )}
//         </div>
//       <div className="form-actions">
//         <button onClick={handleSave}>Save</button>
//         <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//       </div>
//     </div>
//   );
// };

// export default Register_2;
