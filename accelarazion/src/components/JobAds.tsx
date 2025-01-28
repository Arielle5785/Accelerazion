import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const JobAds: React.FC = () => {
  const {user} = useAuth();
  console.log(user);
  
  const navigate = useNavigate();  
  
  // Form fields
  const [formData, setFormData] = useState({

    jobTitle: "",
    jobCompany: "",
    jobUrl: "",
    deadline: "",
    description: "",
    selectedSkills: [] as number[], // Array of skill IDs
  });

  const [skills, setSkills] = useState<Record<string, any[]> | null>(null);

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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle skill selection
  const handleSkillToggle = (skillId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter((id) => id !== skillId)
        : [...prev.selectedSkills, skillId],
    }));
  };

  // Submit job ad
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
    alert("User data is missing. Please log in again.");
    return;
  }
    try {
      
      // Create the job ad
      // console.log('formdata', formData)z
      const response = await axios.post(`${apiBaseUrl}/api/job-ads`, {
        
        jobTitle: formData.jobTitle,
        jobCompany: formData.jobCompany,
        jobUrl: formData.jobUrl,
        deadline: formData.deadline,
        description: formData.description,
        userId: user?.userid,
        userType: user?.type,
        skills: formData.selectedSkills.map((skillId) => Number(skillId))
      });

      const jobId = response.data.id;
      console.log('response.data=>',response.data, "jobID (jobads)", jobId);

      alert("Job ad created successfully!");
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job ad:", error);
      alert("Failed to create job ad. Please try again.");
    }
  };

  return (
    <div className="job-ads-container">
      <h2>Create Job Ad</h2>
      <form className="job-ad-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Job Company</label>
          <input
            name="jobCompany"
            value={formData.jobCompany}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Job URL</label>
          <input
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Skills Selection */}
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
                        checked={formData.selectedSkills.includes(skill.id)}
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
          <button type="submit">Save Job Ad</button>
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobAds;
