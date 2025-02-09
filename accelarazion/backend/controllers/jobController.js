const jobModels = require("../models/jobModels.js");
const { sendEmail } = require("../features/emailService.js")
require("dotenv").config();

module.exports = {
  createJobAd: async (req, res) => {
    const {
      jobTitle,
      jobCompany,
      jobUrl,
      deadline,
      description,
      userId, // Aligned with the model
      userType, // Aligned with the model
      skills,
    } = req.body;
    // console.log("Received Request Body(jobController.js):", req.body);

    if (
      !jobTitle ||
      !jobCompany ||
      !jobUrl ||
      !description ||
      !userId ||
      !userType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const jobData = {
        jobTitle,
        jobCompany,
        jobUrl,
        deadline,
        description,
        user: userId, // Correct field name for the model
        userType, // Correct field name for the model
        skills,
      };

      const job = await jobModels.createJobAd(jobData);
      // console.log("job=>", job.id);

      res
        .status(201)
        .json({ message: "Job ad created successfully", jobId: job.id });
    } catch (error) {
      console.error("Error creating job ad:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addJobSkills: async (req, res) => {
    const { jobId, skillIds } = req.body;
    // console.log(req.body);

    if (!jobId || !Array.isArray(skillIds)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      await jobModels.addJobSkills(jobId, skillIds);
      res.status(200).json({ message: "Job skills added successfully" });
    } catch (error) {
      console.error("Error adding job skills:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllJobAds: async (req, res) => {
    try {
      const jobAds = await jobModels.getAllJobAds();
      res.status(200).json(jobAds);
    } catch (error) {
      console.error("Error fetching job ads:", error);
      res.status(500).json({ message: "Internal server error GAJ" });
    }
  },
    
  getMatchingUsers: async (req, res) => {
    try {
      const jobAds = await jobModels.getMatchingUsers();
      res.status(200).json(jobAds);
    } catch (error) {
      console.error("Error fetching candidates or job ads:", error);
      res.status(500).json({ message: "Internal server error GM controller" });
    }
  },
    
  getJobDetails: async (req, res) => {
    const { jobid } = req.params;
    // console.log("req params jobController", res);
      
    try {
      const job = await jobModels.getJobDetails(jobid);
      res.status(200).json(job);
    } catch (error) {
      console.error("Error fetching job details:", error);
      res.status(500).json({ message: "Internal server error GJD" });
    }
  },
    
  getMatchingUsers: async (req, res) => {
    const { jobid } = req.params; // Using job_id
    try {
      const candidates = await jobModels.getMatchingUsers(jobid);
      res.status(200).json(candidates);
    } catch (error) {
      console.error("Error fetching matching candidates:", error);
      res.status(500).json({ message: "Internal server error GMU" });
    }
  },
    
  sendEmail: async (req, res) => {
  const { to, subject, text, html } = req.body;
    // console.log("request body. jbController", req.body);

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Attempting to send email to:", to);
  console.log("Email subject:", subject);
  console.log("Email text:", text);

  // try {
  //   const response = await sendEmail(to, subject, text, html);
  //   console.log("Email response:", response);
  //   res.json({ message: "Email sent successfully", response });
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   res.status(500).json({ error: "Failed to send email" });
    // }
  try {
      const recipientEmails = recipients.join(", ");
      const subject = `Job Opportunity: ${jobDetails.job_title}`;
      const text = `Dear Candidate,

      You are being contacted regarding the job opportunity titled "${jobDetails.job_title}" at ${jobDetails.job_company}.
      Deadline: ${jobDetails.deadline}.
      Description: ${jobDetails.description}

      For more information, contact us:
      Email of the person who posted the job: ${jobDetails.email}
      Phone: ${jobDetails.phone_number}
      First Name: ${jobDetails.first_name} - Last Name: ${jobDetails.last_name}

      Best regards,
      The Accelerazion Team`;

      const html = `
        <h1>Job Opportunity: ${jobDetails.job_title}</h1>
        <p><strong>Company:</strong> ${jobDetails.job_company}</p>
        <p><strong>Deadline:</strong> ${jobDetails.deadline}</p>
        <p><strong>Description:</strong> ${jobDetails.description}</p>
        <p><strong>Contact:</strong> ${jobDetails.email}, ${jobDetails.phone_number}</p>
      `;

      // Call sendEmail function
      await sendEmail(recipientEmails, subject, text, html);

      res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
      console.error("Error sending emails:", error);
      res.status(500).json({ message: "Failed to send emails." });
    }
    
},

}
