const { db } = require('../db/db.js');
const bcrypt = require("bcrypt");

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
        // console.log("getSkillsModel =>");
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
  
   

  getFullData: async (userId) => {
    try {
      const user = await db("users as u")
        .join("countries as c", "u.current_country", db.raw("c.id::TEXT"))
        .join("users_class as uc", "u.id", "uc.user_id")
        .join("type_users as tu", "uc.type_id", "tu.id")
        .select(
          "u.id as id",
          "u.email",
          "u.first_name as firstName",
          "u.last_name as lastName",
          "u.gender as gender",
          "c.country_name as currentCountry",
          "c.phone_code as phoneCode",
          "u.phone_number as phoneNumber",
          "tu.type as userType",
          "u.current_job_title as currentJobTitle",
          "u.current_company as currentCompany",
          "u.linkedin_profile as linkedinProfile",
          "u.github_profile as githubProfile",
          "u.commit_alyah as commitAlyah",
          "u.dob as dob",
          "u.israel_job as israelJob",
          "u.mentor as mentor"
        )
        .where("u.id", userId)
        .first();

      if (!user) return null;

      const languages = await db("user_languages as ul")
        .join("languages as l", "ul.language_id", "l.id")
        .join("languages_level as ll", "ul.level_id", "ll.id")
        .select("l.language_name as language", "ll.level as level")
        .where("ul.user_id", userId);

      const skills = await db("user_skills as us")
        .join("skills as s", "us.skill_id", "s.id")
        .select("s.id as id", "s.skill_name","s.category_skills")
        .where("us.user_id", userId);

      user.languages = languages;
      user.skills = skills;

      return user;
    } catch (error) {
      console.error("Error in getUserFullData:", error);
      throw error;
    }
  },
};
