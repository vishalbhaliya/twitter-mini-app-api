const router = require("express").Router();
const TweetController = require("../controllers/TweetController");

router.use("/getTweets", TweetController.getTweets);
router.use("/getTweet", TweetController.getTweet);
router.use("/deleteTweet", TweetController.deleteTweet);
router.use("/updateTweet", TweetController.updateTweet);

module.exports = router;