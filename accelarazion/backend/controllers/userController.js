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

    if (!password || !email || !firstName || !lastName||!userType) {
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
        userType
      };

      const user = await userModel.createUser(userData);
      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error(error);
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
    const { email, password } = req.body;
    console.log(password, email);

    try {
      const user = await userModel.getUserByEmail(email);
      console.log(user);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(password + "", user.password_hash);
      //   console.log(passwordMatch);

      if (!passwordMatch) {
        res.status(404).json({ message: "Wrong password" });
        return;
      }
      const { JWT_SECRET } = process.env;
      /** generate a token */
      const accessToken = jwt.sign(
        { userid: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "5m" }
      );

      /** set the token in httpOnly cookie */
      res.cookie("token", accessToken, {
        maxAge: 60 * 5 * 1000,
        httpOnly: true,
      });

      /** response to client */
      res.status(200).json({
        message: "Login Successfully",
        user: { userid: user.id, email: user.email },
        token: accessToken,
      });
    } catch (error) {
      console.log(error);
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
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  logoutUser: (req, res) => {
    res.clearCookie("token");
    req.cookies.token = null;
    delete req.cookies.token;
    /** set nul in db column */
    res.sendStatus(200);
  },
  verifyAuth: (req, res) => {
    const { userid, email } = req.user;
    const { JWT_SECRET } = process.env;
    const newAccessToken = jwt.sign({ userid, email }, JWT_SECRET, {
      expiresIn: "5m",
    });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 5 * 1000,
    });

    res.json({
      message: "verified",
      user: { userid, email },
      token: newAccessToken,
    });
    // res.sendStatus(200);
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
  try {
    const skills = await userModel.getSkills();
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},
addUserSkills: async (req, res) => {
  const { userId, skillIds } = req.body;
  if (!userId || !Array.isArray(skillIds)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    await userModel.addUserSkills(userId, skillIds);
    res.status(200).json({ message: "Skills saved successfully" });
  } catch (error) {
    console.error("Error saving user skills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  },
createJobAd: async (req, res) => {
  const { jobTitle, jobCompany, jobUrl, createdDate, deadline, sponsorId } = req.body;

  if (!jobTitle || !jobCompany || !jobUrl || !sponsorId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const job = await userModel.createJobAd({
      job_title: jobTitle,
      job_company: jobCompany,
      job_url: jobUrl,
      created_date: createdDate,
      deadline,
      sponsor_id: sponsorId,
    });
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
    await userModel.addJobSkills(jobId, skillIds);
    res.status(200).json({ message: "Job skills added successfully" });
  } catch (error) {
    console.error("Error adding job skills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},
getAllJobAds: async (req, res) => {
  try {
    const jobAds = await userModel.getAllJobAds();
    res.status(200).json(jobAds);
  } catch (error) {
    console.error("Error fetching job ads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


};

