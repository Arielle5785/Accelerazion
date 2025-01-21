const { db } = require('../db/db.js');
const bcrypt = require("bcrypt");
//createUser, getCountries, getLanguages, getLanguageLevels, getUserTypes, getSkills, addUserSkills, getUserByEmail, getUsers, createJobAd,

module.exports = {
  createUser: async (userData) => {
    console.log(userData);
    
    const trx = await db.transaction();
    try {
      // Hash the password
      const hashPassword = await bcrypt.hash(userData.password + "", 10);

      const country = await trx("countries")
        .select("country_name", "phone_code")
        .where("country_name", userData.currentCountry) // Use country_name instead of id
        .first();

      if (!country) {
        throw new Error("Invalid country name");
      }

      const userType = await trx("type_users")
        .select("id")
        .where("type", userData.userType)
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
          current_country: country.country_name,
          phone_code: country.phone_code,
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
            .where("language_name", lang.language)
            .first();

          const level = await trx("languages_level")
            .select("id")
            .where("level", lang.level)
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
  const [job] = await db("jobs_ad").insert(jobData, ["id"]);
  return job;
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

};
