const { db } = require('../db/db.js');
const bcrypt = require("bcrypt");
const userModelFunction = require("../models/userModel.js");
// const { sendEmail } = require('../controllers/jobController.js');

module.exports = {

    createJobAd: async (jobData) => {
        const trx = await db.transaction();
        try {
            // const skills = getSkills();
            // const user = getFullData();
            // console.log("Job Data for insert jobModels:", jobData);
            const [job] = await trx("job_ads").insert(
                {
                    job_title: jobData.jobTitle,
                    job_company: jobData.jobCompany,
                    job_url: jobData.jobUrl,
                    deadline: jobData.deadline,
                    description: jobData.description,
                    user_id: Number(jobData.user),
                    type_id: Number(jobData.userType),
                    created_date: new Date().toISOString(),
                    
                },
                ["id"]
            );
            // console.log("inserted job jobModels=>", job);
            
  
            if (jobData.skills && Array.isArray(jobData.skills)) {
                const jobSkills = jobData.skills.map((skillId) => ({
                    job_id: job.id,
                    skills_id: skillId,
                }));
                await trx("job_skills").insert(jobSkills);
            }
  
            await trx.commit();
            return job;
        } catch (error) {
            await trx.rollback();
            console.error("Error creating job ad:", error);
            throw error;
        }
    },
  
    addJobSkills: async (jobId, skillIds) => {
        const jobSkills = skillIds.map((skillId) => ({
            job_id: jobId,
            skill_id: skillId,
        }));
        await db("job_skills").insert(jobSkills);
    },
    
    getAllJobAds: async () => {
  try {
    const jobAds = await db("job_ads as ja")
      .join("users as u", "ja.user_id", "u.id") // Join users table on user_id
      .leftJoin("job_skills as js", "ja.id", "js.job_id") // Join job_skills table on job_id
      .leftJoin("skills as s", "js.skills_id", "s.id") // Join skills table on skills_id
      .leftJoin("type_users as tu", "ja.type_id", "tu.id") // Join type_users table on type_id
      .select(
        "ja.id as job_id",
        "ja.job_title",
        "ja.job_company",
        "ja.job_url",
        "ja.created_date",
        "ja.deadline",
        "ja.description",
        "u.first_name",
        "u.last_name",
        "u.gender",
        "u.phone_number",
        "u.email",
        "tu.type",
        db.raw("json_agg(s.skill_name) as required_skills") // Aggregate skills into a JSON array
      )
      .groupBy("ja.id", "u.id", "tu.id"); // Group by job_ads, users, and type_users IDs

    return jobAds;
  } catch (error) {
    console.error("Error fetching job ads:", error);
    throw error;
  }
    },  
    
    getMatchingUsers: async (jobid) => {
  try {
    const results = await db("users as u")
      .join("user_skills as us", "u.id", "us.user_id")
      .join("job_skills as js", "us.skill_id", "js.skills_id")
      .join("users_class as uc", "u.id", "uc.user_id")
      .select(
        "u.id as user_id", "u.phone_number as user_phone_number", "u.email as user_email",
          db.raw("CONCAT(u.first_name, ' ', u.last_name) as user_name"),
          db.raw("COUNT(js.skills_id) as matching_skills")
      )
      .where("js.job_id", jobid)
      .andWhere("uc.type_id", 1) // Ensuring we filter only mentees
      .groupBy("u.id")
      .orderBy("matching_skills", "desc")
      .limit(10);

    return results;
  } catch (error) {
    console.error("Error fetching matching users:", error);
    throw error;
  }
    },
    
    getJobDetails: async (jobId = null) => {
      try {
        const query = db("job_ads as ja")
          .join("users as u", "ja.user_id", "u.id") // Join users table on user_id
          .leftJoin("job_skills as js", "ja.id", "js.job_id") // Join job_skills table on job_id
          .leftJoin("skills as s", "js.skills_id", "s.id") // Join skills table on skills_id
          .leftJoin("type_users as tu", "ja.type_id", "tu.id") // Join type_users table on type_id
          .select(
            "ja.id as job_id",
            "ja.job_title",
            "ja.job_company",
            "ja.job_url",
            "ja.created_date",
            "ja.deadline",
            "ja.description",
            "u.first_name",
            "u.last_name",
            "u.gender",
            "u.phone_number",
            "u.email",
            "tu.type",
            db.raw("json_agg(s.skill_name) as required_skills") // Aggregate skills into a JSON array
          )
          .groupBy("ja.id", "u.id", "tu.id"); // Group by job_ads, users, and type_users IDs

        // If jobId is provided, add a WHERE clause to filter by job ID
        if (jobId) {
          query.where("ja.id", jobId);
        }

        const results = await query;
        return jobId ? results[0] : results; // Return a single job if jobId is provided, else return all jobs
      } catch (error) {
        console.error("Error fetching job details:", error);
        throw error;
      }
    },

//   sendEmail: async (req, res) => {
//     const { recipients, jobDetails } = req.body;
//     console.log("recipients=>",recipients,"jobdetails=>",jobDetails)
//     try {
//       const recipientEmails = recipients.join(", ");
//       const subject = `Job Opportunity: ${jobDetails.job_title}`;
//       const text = `Dear Candidate,
    
//       You are being contacted regarding the job opportunity titled "${jobDetails.job_title}" at ${jobDetails.job_company}.
//       Deadline: ${jobDetails.deadline}.
//       Description: ${jobDetails.description}

//       For more information, contact us:
//       Email of the person who have posted the job : ${jobDetails.email}
//       Phone: ${jobDetails.phone_number}
//       First Name: ${jobDetails.first_name} - Last Name: ${jobDetails.last_name}

//       Best regards,
//       The Accelerazion Team`;

//     const html = `
//       <h1>Job Opportunity: ${jobDetails.job_title}</h1>
//       <p><strong>Company:</strong> ${jobDetails.job_company}</p>
//       <p><strong>Deadline:</strong> ${jobDetails.deadline}</p>
//       <p><strong>Description:</strong> ${jobDetails.description}</p>
//       <p><strong>Contact:</strong> ${jobDetails.email}, ${jobDetails.phone_number}</p>
//     `;

//     // Send email using the emailService
//     await sendEmail(recipientEmails, subject, text, html);

//     res.status(200).json({ message: "Emails sent successfully!" });
//   } catch (error) {
//     console.error("Error sending emails:", error);
//     res.status(500).json({ message: "Failed to send emails." });
//   }
// }    
}