const jobModel = require("../models/jobModels.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModels = require("../models/jobModels.js");
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
  if (!jobTitle || !jobCompany || !jobUrl || !description || !userId || !userType) {
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
    res.status(201).json({ message: "Job ad created successfully", jobId: job.id });
  } catch (error) {
    console.error("Error creating job ad:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},

  addJobSkills: async (req, res) => {
    const { jobId, skillIds } = req.body;

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

//   getAllJobAds: async (req, res) => {
//     try {
//       const jobAds = await jobModels.getAllJobAds();
//       res.status(200).json(jobAds);
//     } catch (error) {
//       console.error("Error fetching job ads:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
//   getMatchingUsers: async (jobId) => {
//   const query = `
//     SELECT 
//         u.id AS user_id, 
//         u.name AS user_name, 
//         COUNT(js.skill_id) AS matching_skills
//     FROM 
//         job_skills js
//     JOIN 
//         users_skills us ON js.skill_id = us.skill_id
//     JOIN 
//         users u ON us.user_id = u.id
//     JOIN 
//         users_class uc ON u.id = uc.user_id
//     WHERE 
//         js.job_id = ?
//         AND uc.type_id = 1
//     GROUP BY 
//         u.id, u.name
//     ORDER BY 
//         matching_skills DESC
//     LIMIT 10;
//   `;
//   const [results] = await db.execute(query, [jobId]);
//   return results;
// }
}