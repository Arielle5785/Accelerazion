import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/useAuth";

const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};
type TJobDetails = {
  job_id: number;
  job_title: string;
  job_company: string;
  job_url: string;
  created_date: string;
  deadline: string;
  description: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  email: string;
  type: string;
  required_skills: string[];
};

type TCandidate = {
  user_id: number|string;
  user_name: string;
  user_email: string;
  matching_skills: number | string;
  user_phone_number:number|string

};

type TTodoItem = {
  job_title: string;
  job_company: string;
  job_url: string;
  posted_by: string;
  deadline: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  email: string;
  user_name: string;
  user_email: string;
  user_phone_number: number | string;
  email_sent: boolean;
};


const Dashboard_2: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const jobid = location.state?.jobId;

  const [jobDetails, setJobDetails] = useState<TJobDetails | null>(null);
  const [candidates, setCandidates] = useState<TCandidate []>([]);
  const [loading, setLoading] = useState(true);
  const [todoList, setTodoList] = useState<TTodoItem[]>([]);
  
    
    useEffect(() => {
    if (user?.type !== 3) {
      navigate("/"); // Redirect non-type-3 users to home
      return;
    }

    const fetchJobDetails = async () => {
      try {
        // Fetch the selected job details
          const jobResponse = await axios.get(`${apiBaseUrl}/api/job/${jobid}`);
        //   console.log("jobResponse",jobResponse);
        setJobDetails(jobResponse.data);

        // Fetch matching candidates for the selected job
        const candidatesResponse = await axios.get(
          `${apiBaseUrl}/api/job/${jobid}/candidates`
          );
        //   console.log("candidatesResponse",candidatesResponse);
        setCandidates(candidatesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details or candidates:", error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobid, user, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!jobDetails) {
    return <p>No job details found.</p>;
  }

  return (
    <div>
      <h2>Job Details</h2>
      <div className="job-ad">
        <h3>{jobDetails.job_title}</h3>
        <p>Company: {jobDetails.job_company}</p>
        <p>
          URL:{" "}
          <a
            href={jobDetails.job_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {jobDetails.job_url}
          </a>
        </p>
        <p>Created Date: {formatDate(jobDetails.created_date)}</p>
        <p>Deadline: {formatDate(jobDetails.deadline)}</p>
        <p>
          Posted By: {jobDetails.first_name} {jobDetails.last_name} (
          {jobDetails.type})
        </p>
        <p>Email: {jobDetails.email}</p>
        <p>Phone: {jobDetails.phone_number}</p>
        <p>Description: {jobDetails.description}</p>
        <p>Required Skills: {jobDetails.required_skills?.join(", ")||"No skills listed"}</p>
      </div>

      <h2>Matching Candidates</h2>
      {candidates ? (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.user_id}>
            <p>Name: {candidate.user_name} </p>
            <p>Email: {candidate.user_email}</p>
            <p>Phone: {candidate.user_phone_number}</p>
            <p>Matching Skills: {candidate.matching_skills}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matching candidates found.</p>
      )}

      <div className="form-actions">
        <button type="button" onClick={() => navigate("/")}>
          Home
        </button>
        <button type="button" onClick={() => navigate("/all-jobs")}>
          Back to All Jobs
        </button>
      </div>
    </div>
  );
};

export default Dashboard_2;
