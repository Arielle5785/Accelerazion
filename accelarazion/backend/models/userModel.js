const { db } = require('../db/db.js');
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (userData) => {
    const trx = await db.transaction();
    try {
      // Hash the password
      const hashPassword = await bcrypt.hash(userData.password + "", 10);

      // Get `current_country` and `phone_code` from the `countries` table
      const country = await trx("countries")
        .select("country_name", "phone_code")
        .where("id", userData.currentCountryId)
        .first();

      if (!country) {
        throw new Error("Invalid country ID");
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

      await trx.commit();
      return user;
    } catch (error) {
      await trx.rollback();
      console.error(error);
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
};
