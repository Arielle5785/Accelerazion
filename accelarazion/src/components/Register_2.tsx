import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";


const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Register_2: React.FC = () => {
  const [searchParams] = useSearchParams();// Get the userId from the query parameter
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");
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
  //   try {
  //     await axios.post(`${apiBaseUrl}/api/user-skills`, {
  //       userId,
  //       skillIds: selectedSkills,
  //     });
  //     alert("Skills saved successfully!");
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("Error saving skills:", error);
  //   }
    // };
      try {
      const payload = userId
        ? { userId, skills }
        : { email, skills };

      await axios.post(`${apiBaseUrl}/api/register/skills`, payload, {
        withCredentials: true,
      });
      alert("Skills saved successfully!");
    } catch (err: any) {
      console.error(err.response?.data?.message || "Error saving skills");
    }
  };

  return (
    <div className="skills-container">
      <h2>Select Your Skills</h2>
      {skills ? (
        Object.entries(skills).map(([category, skills]) => (
          <div key={category} className="category">
            <h3>{category}</h3>
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
      <div className="form-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    </div>
  );
};

export default Register_2;
