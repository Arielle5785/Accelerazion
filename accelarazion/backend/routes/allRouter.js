const { Router } = require("express");
const userController = require("../controllers/userController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const router = Router();
// const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/countries", userController.getCountries);
router.get("/languages", userController.getLanguages);
router.get("/languages-level", userController.getLanguageLevels);
router.get("/type-users", userController.getUserTypes);
router.get("/skills", userController.getSkills);
router.post("/user-skills", userController.addUserSkills);
router.get("/userFullData/:userid", userController.getFullData);
// router.get("/user-languages/:userid", userController.getLanguagesByUserID)
// router.get("/user-skills/:userid", userController.getUserSkillsByUserID);
// router.get("/user-class/:userid", userController.getUserTypeByUserID);
router.post("/login", userController.loginUser);
router.get("/all", verifyToken, userController.getUsers);
router.post("/logout", userController.logoutUser);
router.get("/auth", verifyToken, userController.verifyAuth);
// router.post("/job-ads", userController.createJobAd);
// router.get("/all-job-ads", userController.getAllJobAds);
// router.post("/job-skills", userController.addJobSkills);

module.exports = router;
