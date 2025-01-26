const { db } = require('../db/db.js');
const bcrypt = require("bcrypt");
const userModelFunction = require("../models/userModel.js")

module.exports = {

    createJobAd: async (jobData) => {
        const trx = await db.transaction();
        try {
            // const skills = getSkills();
            // const user = getFullData();
            console.log("Job Data for insert jobModels:", jobData);
            const job = await trx("job_ads").insert(
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
            ); console.log("inserted job jobModels=>",job);
            
  
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
  
    // getAllJobAds: async () => {
    //     try {
    //         const jobAds = await db("jobs_ad as j")
    //             .join("users as u", "j.sponsor_id", "u.id")
    //             .leftJoin("job_skills as js", "j.id", "js.job_id")
    //             .leftJoin("skills as s", "js.skill_id", "s.id")
    //             .select(
    //                 "j.id as job_id",
    //                 "j.job_title",
    //                 "j.job_company",
    //                 "j.job_url",
    //                 "j.created_date",
    //                 "j.deadline",
    //                 "u.first_name as sponsor_first_name",
    //                 "u.last_name as sponsor_last_name",
    //                 "u.email as sponsor_email",
    //                 "u.phone_number as sponsor_phone",
    //                 db.raw("json_agg(s.skill_name) as required_skills")
    //             )
    //             .groupBy("j.id", "u.id");
  
    //         return jobAds;
    //     } catch (error) {
    //         console.error("Error fetching job ads:", error);
    //         throw error;
    //     }
    // },
  
    // getMatchingUsers: async (jobId) => {
    //     try {
    //         const query = `
    //       SELECT 
    //         u.id AS user_id, 
    //         u.first_name || ' ' || u.last_name AS user_name, 
    //         COUNT(js.skill_id) AS matching_skills
    //       FROM 
    //         job_skills js
    //       JOIN 
    //         users_skills us ON js.skill_id = us.skill_id
    //       JOIN 
    //         users u ON us.user_id = u.id
    //       JOIN 
    //         users_class uc ON u.id = uc.user_id
    //       WHERE 
    //         js.job_id = ?
    //         AND uc.type_id = 1
    //       GROUP BY 
    //         u.id
    //       ORDER BY 
    //         matching_skills DESC
    //       LIMIT 10;
    //     `;
    //         const [results] = await db.raw(query, [jobId]);
    //         return results;
    //     } catch (error) {
    //         console.error("Error fetching matching users:", error);
    //         throw error;
    //     }
    // },
   
}