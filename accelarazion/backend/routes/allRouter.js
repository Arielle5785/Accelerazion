const { Router } = require("express");
const userController = require("../controllers/userController.js");
const jobController = require("../controllers/jobController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const router = Router();
// const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/countries", userController.getCountries);
router.get("/languages", userController.getLanguages);
router.get("/languages-level", userController.getLanguageLevels);
router.get("/type-users", userController.getUserTypes);
router.get("/skills", userController.getSkills);
router.post("/register/skills", userController.addUserSkills);
router.get("/userFullData/:userid", userController.getFullData);
router.post("/login", userController.loginUser);
router.get("/all", verifyToken, userController.getUsers);
router.post("/logout", userController.logoutUser);
router.get("/auth", verifyToken, userController.verifyAuth);
router.post("/job-ads", jobController.createJobAd);
router.get("/all-job-ads", jobController.getAllJobAds);
router.post("/job-skills", jobController.addJobSkills);
router.get("/job/:jobid", jobController.getJobDetails);
router.get("/job/:jobid/candidates", jobController.getMatchingUsers);
router.post("/send-email", jobController.sendEmail);

module.exports = router;
