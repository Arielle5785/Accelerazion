import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};
const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";
type TJobAds = 
  {
      job_id: number; job_title: string; job_company: string; job_url: string; created_date: string; deadline: string; description: string; first_name: string; last_name: string; gender: string;phone_number: string; email: string; type: string; required_skills: string[]; 
  }

const AllJobsAd: React.FC = () => {
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();  
  const [jobsAds, setJobAds] = useState<TJobAds[]>([])
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
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

      const handleCheckboxChange = (jobId: number) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.includes(jobId)
        ? prevSelected.filter((id) => id !== jobId)
        : [...prevSelected, jobId]
    );
  };
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
          {user?.type === 3 && (
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(job.job_id)}
                    checked={selectedJobs.includes(job.job_id)}
                    style={{ marginRight: "10px" }}
                  />
                )}
          <h3>{job.job_title}</h3>
          <p>Company: {job.job_company}</p>
          <p>URL: <a href={job.job_url} target="_blank" rel="noopener noreferrer">{job.job_url}</a></p>
          <p>Created Date: {formatDate(job.created_date)}</p>
          <p>Deadline: {formatDate(job.deadline)}</p>
          <p>Posted By: {job.first_name} {job.last_name}{job.type}</p>
          <p>Email: {job.email}</p>
          <p>Phone: {job.phone_number}</p>
          <p>Required Skills: {job.required_skills.join(", ")}</p>
          {user?.type === 3 && (
          <button
            type="button"
            onClick={() => navigate("/dashboard_2", { state: { jobId: job.job_id  } })}
            disabled={selectedJobs.length === 0}
          >
            Matching Candidates
          </button>
        )}
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
