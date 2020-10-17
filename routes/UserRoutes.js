const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post("/login", UserController.login);
router.use("/signup", UserController.signup);
router.use("/users/follow", UserController.follow);
router.get("/users/following", UserController.getFollowing);

module.exports = router;