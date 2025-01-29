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
  phone_number: string|number;
  email: string;
  user_id: number|string;
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
  const [candidates, setCandidates] = useState<TCandidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<TCandidate[]>([]);
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
  
// Handle candidate selection
  const handleCandidateSelect = (candidate: TCandidate) => {
    setSelectedCandidates((prev) =>
      prev.some((c) => c.user_id === candidate.user_id)
      ? prev.filter((c) => c.user_id !== candidate.user_id)
      : [...prev, candidate]
  );
  };

  // Send email (dummy function for now, replace with actual email-sending logic)
  const sendEmail = async () => {
    if (!jobDetails) return;
    const recipientEmails = selectedCandidates.map((c) => c.user_email); // Use candidate emails
  console.log("Sending email to:", recipientEmails);

  try {
    await axios.post(`${apiBaseUrl}/send-email`, {
      jobDetails, // Job details
      recipients: recipientEmails, // Candidate emails
    });
    alert("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending emails:", error);
    alert("Failed to send emails.");
  }
};

  // Save to the bottom table
  const handleSave = () => {
    if (!jobDetails) return;

    const newTodoItems = selectedCandidates.map((candidate) => ({
      job_title: jobDetails.job_title,
      job_company: jobDetails.job_company,
      job_url: jobDetails.job_url,
      posted_by: `${jobDetails.first_name} ${jobDetails.last_name}`,
      deadline: formatDate(jobDetails.deadline),
      first_name: jobDetails.first_name,
      last_name: jobDetails.last_name,
      gender: jobDetails.gender,
      phone_number: jobDetails.phone_number,
      email: jobDetails.email,
      user_id: candidate.user_id,
      user_name: candidate.user_name,
      user_email: candidate.user_email,
      user_phone_number: candidate.user_phone_number,
      email_sent: false,
    }));

    setTodoList((prev) => [...prev, ...newTodoItems]);
    setCandidates((prev) =>
      prev.filter(
        (candidate) => !selectedCandidates.some((sel) => sel.user_id === candidate.user_id)
      )
    );
    setSelectedCandidates([]); // Clear selected candidates
  }; // Clear selected candidates
  

  // Delete item from the table
    const handleDelete = (index: number) => {
    const deletedCandidate = todoList[index];
    setTodoList((prev) => prev.filter((_, i) => i !== index));

    setCandidates((prev) => [...prev,
      {
        user_id: deletedCandidate.user_id,
        user_name: deletedCandidate.user_name,
        user_email: deletedCandidate.user_email,
        matching_skills: 10, // Adjust as needed
        user_phone_number: deletedCandidate.user_phone_number,
      },
    ]);
  };

  // Mark item as complete (strikethrough)
  const handleMarkComplete = (index: number) => {
    setTodoList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, email_sent: !item.email_sent } : item
      )
    );
  };

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
        <p>URL:{" "}
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
        <p>Sponsor Email: {jobDetails.email}</p>
        <p>Sponsor Phone: {jobDetails.phone_number}</p>
        <p>Job Ad Description: {jobDetails.description}</p>
        <p>Required Skills: {jobDetails.required_skills?.join(", ")||"No skills listed"}</p>
      </div>

      <h2>Matching Candidates</h2>
      {candidates ? (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.user_id}>
              <input
                type="checkbox" onChange={() => handleCandidateSelect(candidate)}
                checked={selectedCandidates.some((c) => c.user_id === candidate.user_id)}
              />
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
        <button type="button" onClick={() => navigate("/all-job-ads")}>
          Back to All Jobs
        </button>
      </div>
    <button onClick={sendEmail} disabled={selectedCandidates.length === 0}>
        Send Email
      </button>
      <button onClick={handleSave} disabled={selectedCandidates.length === 0}>
        Save
      </button>

      <h2>Job Dashboard - Selected Candidates List</h2>
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Job Company</th>
            <th>Posted By</th>
            <th>Deadline</th>
            <th>Candidate Name</th>
            <th>Email Sent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todoList.map((item, index) => (
            <tr key={index}>
              <td>{item.job_title}</td>
              <td>{item.job_company}</td>
              <td>{item.posted_by}</td>
              <td>{item.deadline}</td>
              <td>{item.user_name}</td>
              <td>
                {item.email_sent ? <s>Sent</s> : "Pending"}
              </td>
              <td>
                <button onClick={() => handleMarkComplete(index)}>
                  {item.email_sent ? "Undo" : "Complete"}
                </button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default Dashboard_2;
      
    
