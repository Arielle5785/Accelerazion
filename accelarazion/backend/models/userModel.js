const { db } = require('../db/db.js');
const bcrypt = require("bcrypt");
//createUser, getCountries, getLanguages, getLanguageLevels, getUserTypes, getSkills, addUserSkills, getUserByEmail, getUsers, createJobAd, addJobSkills, getAllJobAds, getMatchingUsers

module.exports = {
  createUser: async (userData) => {
    // console.log(userData);
    
    const trx = await db.transaction();
    try {
      // Hash the password
      const hashPassword = await bcrypt.hash(userData.password + "", 10);

      const country = await trx("countries")
        .select("id")
        .where("id", userData.currentCountry) // Use country_name instead of id
        .first();

      if (!country) {
        throw new Error("Invalid country name");
      }

      const userType = await trx("type_users")
        .select("id")
        .where("id", userData.userType)
        .first();

      if (!userType) {
        throw new Error("Invalid user type");
      }

      // Insert the user data into the `users` table
      const [user] = await trx("users").insert(
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          gender: userData.gender,
          email: userData.email.toLowerCase(),
          current_country: country.id,
          phone_code: country.id,
          phone_number: userData.phoneNumber,
          current_job_title: userData.currentJobTitle,
          current_company: userData.currentCompany,
          linkedin_profile: userData.linkedinProfile,
          github_profile: userData.githubProfile,
          commit_alyah: userData.commitAlyah,
          dob: userData.dob,
          israel_job: userData.israelJob,
          password_hash: hashPassword,
          created_date: new Date().toISOString(), // Set current date
        },
        ["id", "email"]
      );

      // Handle languages and their levels
      if (userData.languages && userData.languages.length > 0) {
        for (const lang of userData.languages) {
          const language = await trx("languages")
            .select("id")
            .where("id", lang.language)
            .first();

          const level = await trx("languages_level")
            .select("id")
            .where("id", lang.level)
            .first();

          if (!language || !level) {
            throw new Error("Invalid language or level");
          }

          await trx("user_languages").insert({
            user_id: user.id,
            language_id: language.id,
            level_id: level.id,
          });
        }
      }

      // Insert into user_class
      await trx("users_class").insert({
        user_id: user.id,
        type_id: userType.id,
      });

      await trx.commit();
      return user;
    } catch (error) {
      await trx.rollback();
      console.error(error);
      throw error;
    }
  },

  getCountries: async () => {
    try {
      const countries = await db("countries").select("id", "country_name", "phone_code");
      return countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },

  getLanguages: async () => {
    try {
      const languages = await db("languages").select("id", "language_name");
      return languages;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  },

  getLanguageLevels: async () => {
    try {
      const levels = await db("languages_level").select("id", "level");
      return levels;
    } catch (error) {
      console.error("Error fetching language levels:", error);
      throw error;
    }
  },

  getUserTypes: async () => {
  try {
    const userTypes = await db("type_users").select("id", "type");
    return userTypes;
  } catch (error) {
    console.error("Error fetching user types:", error);
    throw error;
  }
  },

  getSkills: async () => {
  try {
    const skills = await db("skills").select("id", "skill_name", "category_skills");
    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
  },

  addUserSkills: async (userId, skillIds) => {
  try {
    const userSkills = skillIds.map((skillId) => ({
      user_id: userId,
      skill_id: skillId,
    }));
    await db("user_skills").insert(userSkills);
  } catch (error) {
    console.error("Error saving user skills:", error);
    throw error;
  }
},

  getUserByEmail: async (email) => {
    try {
      const user = await db("users")
        .select("id", "email", "password_hash")
        .where({ email: email.toLowerCase() })
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const users = await db("users")
        .select("id", "email", "first_name", "last_name", "current_country");
      return users;
    } catch (error) {
      throw error;
    }
  },

  createJobAd: async (jobData) => {
  const trx = await db.transaction();
  try {
    const [job] = await trx("job_ads").insert(
      {
        job_title: jobData.jobTitle,
        job_company: jobData.jobCompany,
        job_url: jobData.jobUrl,
        deadline: jobData.deadline,
        description: jobData.description,
        user_id: jobData.user, // This should be the user_id from the users table
        type_id: jobData.userType, // This should be the type_id from the users_class table
        created_date: new Date().toISOString(),
      },
      ["id"]
    );

    if (jobData.skills && Array.isArray(jobData.skills)) {
      const jobSkills = jobData.skills.map((skillId) => ({
        job_id: job.id,
        skill_id: skillId,
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
    const jobAds = await db("jobs_ad as j")
      .join("users as u", "j.sponsor_id", "u.id")
      .leftJoin("job_skills as js", "j.id", "js.job_id")
      .leftJoin("skills as s", "js.skill_id", "s.id")
      .select(
        "j.id as job_id",
        "j.job_title",
        "j.job_company",
        "j.job_url",
        "j.created_date",
        "j.deadline",
        "u.first_name as sponsor_first_name",
        "u.last_name as sponsor_last_name",
        "u.email as sponsor_email",
        "u.phone_number as sponsor_phone",
        db.raw("json_agg(s.skill_name) as required_skills")
      )
      .groupBy("j.id", "u.id");

    return jobAds;
  } catch (error) {
    console.error("Error fetching job ads:", error);
    throw error;
  }
  },

 getMatchingUsers: async (jobId) => {
    try {
      const query = `
        SELECT 
          u.id AS user_id, 
          u.first_name || ' ' || u.last_name AS user_name, 
          COUNT(js.skill_id) AS matching_skills
        FROM 
          job_skills js
        JOIN 
          users_skills us ON js.skill_id = us.skill_id
        JOIN 
          users u ON us.user_id = u.id
        JOIN 
          users_class uc ON u.id = uc.user_id
        WHERE 
          js.job_id = ?
          AND uc.type_id = 1
        GROUP BY 
          u.id
        ORDER BY 
          matching_skills DESC
        LIMIT 10;
      `;
      const [results] = await db.raw(query, [jobId]);
      return results;
    } catch (error) {
      console.error("Error fetching matching users:", error);
      throw error;
    }
  },
};
