const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  registerUser: async (req, res) => {
    const {
      firstName,
      lastName,
      gender,
      email,
      currentCountry,
      phoneCode,
      phoneNumber,
      currentJobTitle,
      currentCompany,
      linkedinProfile,
      githubProfile,
      commitAlyah,
      dob,
      israelJob,
      password,
      languages,
      userType,
    } = req.body;


    // Validate required fields
    if (!password || !email || !firstName || !lastName || !userType) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    try {
      const userData = {
        firstName,
        lastName,
        gender,
        email,
        currentCountry,
        phoneCode,
        phoneNumber,
        currentJobTitle,
        currentCompany,
        linkedinProfile,
        githubProfile,
        commitAlyah,
        dob,
        israelJob,
        password,
        languages,
        userType,
      };
      
      const user = await userModel.createUser(userData);
      res.status(201).json({
        message: "User registered successfully",
        user
      });
    } catch (error) {
      console.error(error);
      // Handle unique constraint violation for email
      if (error.code === "23505") {
        res.status(400).json({
          message: "Email already exists",
        });
      } else {
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },

  loginUser: async (req, res) => {
    // const { email, password } = req.body;
    const { email, password } = req.body;
    try {
      // console.log(email, password, "login controller");
      
      const user = await userModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(password + "", user.password_hash);
      if (!passwordMatch) {
        return res.status(404).json({ message: "Wrong password" });
      }

      const { JWT_SECRET } = process.env;
      console.log(user);
      // Generate a token
      const accessToken = jwt.sign(
        { userid: user.id, email: user.email, type:user.type_id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set the token in httpOnly cookie
      res.cookie("token", accessToken, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
      });
      try {
        // no need
        // const userFullData = await userModel.getFullData(user.id);
        // if (!userFullData) {
        //   return res.status(404).json({ message: "Full Data from user not found." });
        // }
        // console.log("user full data =>", userFullData)
        ///
        res.status(200).json({
          message: "Login Successfully",
          user: { userid: user.id, email: user.email, type: user.type_id},
        // user: { userid: user.id, email: user.email, user: userFullData},
        token: accessToken,
      });
      } catch (error) {
        console.error(error)
        res.status(500).json({
        message: "Internal server error from full data.",
      });
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await userModel.getUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  logoutUser: (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200); // Logout response
  },

  verifyAuth: (req, res) => {
    const { userid, email, type } = req.user;
    const { JWT_SECRET } = process.env;

    // Refresh the token
    const newAccessToken = jwt.sign({ userid, email, type }, JWT_SECRET, {
      expiresIn: "30m",
    });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 30 * 1000,
    });

    res.json({
      message: "verified",
      user: { userid, email, type },
      token: newAccessToken,
    });
  },

  getCountries: async (req, res) => {
    try {
      const countries = await userModel.getCountries();
      res.status(200).json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getLanguages: async (req, res) => {
    try {
      const languages = await userModel.getLanguages();
      res.status(200).json(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getLanguageLevels: async (req, res) => {
    try {
      const levels = await userModel.getLanguageLevels();
      res.status(200).json(levels);
    } catch (error) {
      console.error("Error fetching language levels:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getUserTypes: async (req, res) => {
    try {
      const userTypes = await userModel.getUserTypes();
      res.status(200).json(userTypes);
    } catch (error) {
      console.error("Error fetching user types:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getSkills: async (req, res) => {
    // console.log("getSkillsController =>");
    
    try {
      const skills = await userModel.getSkills();
      res.status(200).json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addUserSkills: async (req, res) => {
    // const { userId, skillIds } = req.body;
       const { userId, skillIds } = req.body;
    console.log("Request Body:(addUserSkills usercontroller)", req.body);
    console.log("userid usercontroller.js:", userId, "skillsid:", skillIds)
    if (!userId || !Array.isArray(skillIds)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      await userModel.addUserSkills(userId.userid, skillIds);
      res.status(200).json({ message: "Skills saved successfully" });
    } catch (error) {
      console.error("Error saving user skills:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

 getFullData: async (req, res) => {
    // const userId = req.params.userid;
    const { userid } = req.params;
    try {
      const user = await userModel.getFullData(userid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user full data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
    },
 
 
};



