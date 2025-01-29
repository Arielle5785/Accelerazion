import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";
type TJobAds = 
  {
      job_id: number; job_title: string; job_company: string; job_url: string; created_date: string; deadline: string; description: string; user_first_name: string; user_last_name: string; user_gender: string;user_phone_number: string; user_email: string; user_type: string; required_skills: string[]; 
  }

const AllJobsAd: React.FC = () => {
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();  
  const [jobsAds, setJobAds] = useState<TJobAds[]>([])
  console.log(jobsAds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAds = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/all-job-ads`);
        setJobAds(response.data);
        console.log("response data alljobsads:", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job ads:", error);
        setLoading(false);
      }
    };

    fetchJobAds();
  }, []);

  if (loading) {
    return <p>Loading job ads...</p>;
  }

  return (
    <>
    <div>
        <h2>Job Ads</h2>
       <div className="category-card">
      <div className="skills-grid_2">
      {jobsAds.map((job) => (
        <div key={job.job_id} className="job-ad">
          <h3>{job.job_title}</h3>
          <p>Company: {job.job_company}</p>
          <p>URL: <a href={job.job_url} target="_blank" rel="noopener noreferrer">{job.job_url}</a></p>
          <p>Created Date: {job.created_date}</p>
          <p>Deadline: {job.deadline}</p>
          <p>Posted By: {job.user_first_name} {job.user_last_name}{job.user_type}</p>
          <p>Email: {job.user_email}</p>
          <p>Phone: {job.user_phone_number}</p>
          <p>Required Skills: {job.required_skills.join(", ")}</p>
          
        </div>))}
        </div>
      </div> 
      </div>     
      <div className="form-actions">
          {/* <button type="submit">Save Job Ad</button> */}
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
    </>
  );
};

export default AllJobsAd;
