import { useState, useEffect } from "react";
import axios from "axios";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const JobAdsList: React.FC = () => {
  const [jobAds, setJobAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAds = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/all-job-ads`);
        setJobAds(response.data);
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
    <div>
      <h2>Job Ads</h2>
      {jobAds.map((job) => (
        <div key={job.job_id} className="job-ad">
          <h3>{job.job_title}</h3>
          <p>Company: {job.job_company}</p>
          <p>URL: <a href={job.job_url} target="_blank" rel="noopener noreferrer">{job.job_url}</a></p>
          <p>Created Date: {job.created_date}</p>
          <p>Deadline: {job.deadline}</p>
          <p>Posted By: {job.sponsor_first_name} {job.sponsor_last_name}</p>
          <p>Email: {job.sponsor_email}</p>
          <p>Phone: {job.sponsor_phone}</p>
          <p>Required Skills: {job.required_skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

export default JobAdsList;
