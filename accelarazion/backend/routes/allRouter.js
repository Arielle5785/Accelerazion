const { Router } = require("express");
const userController = require("../controllers/userController.js");

const { verifyToken } = require("../middlewares/verifyToken.js");
const router = Router();
// const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/all", verifyToken, userController.getUsers);
router.post("/logout", userController.logoutUser);
router.get("/auth", verifyToken, userController.verifyAuth);

module.exports = router;
