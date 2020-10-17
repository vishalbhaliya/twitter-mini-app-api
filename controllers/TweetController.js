const TweetModel = require("../models/Tweet");
const uuid = require("uuid");
const User = require("../models/User");
const mongoose = require("mongoose");
const responseFormat = {
  status: 200,
  message: "Success",
  data: [],
  error: null,
};

exports.getTweets = async (req, res) => {
  const tweets = await TweetModel.find({ isDeleted: false })
    .populate("user")
    .sort({ createdAt: -1 });
  responseFormat.data = tweets;
  res.send(responseFormat).status(200);
};

exports.getTweet = async (req, res) => {
  const _id = req.params._id;
  const tweet = await TweetModel.findOne({ _id, isDeleted: false });
  responseFormat.data = [tweet];
  res.send(responseFormat).status(200);
};

exports.createTweet = async (req, res) => {
  const args = req.body;
  args._id = mongoose.Types.ObjectId();

  const user = await User.findById({ _id: args.userId, isDeleted: false });
  if (user) {
    const Tweet = new TweetModel({ ...args, user: user });

    const tweet = await Tweet.save();
    responseFormat.data = [tweet];
    const socket = req.app.get("socketio");
    socket.emit("tweet", tweet);
    res.send(responseFormat).status(200);
  } else {
    responseFormat.data = null;
    responseFormat.error = "Please login to add tweet.";
    res.send(responseFormat).status(400);
  }
};

exports.deleteTweet = async (req, res) => {
  const { _id } = req.body;

  TweetModel.remove({ _id }, (error) => {
    if (error) {
      console.log("Error Updating: ", error);
      responseFormat.data = null;
      responseFormat.error = "Something went wrong. Please try again later.";
      res.send(responseFormat).status(400);
    } else {
      responseFormat.data = [true];
      res.send(responseFormat).status(200);
    }
  });
};

exports.updateTweet = async (req, res) => {
  const { _id, tweet } = req.body;

  TweetModel.update(
    { _id },
    {
      $set: { tweet },
    },
    { upsert: true },
    (error) => {
      if (error) {
        console.log("Error Updating: ", error);
        responseFormat.data = null;
        responseFormat.error = "Something went wrong. Please try again later.";
        res.send(responseFormat).status(400);
      } else {
        responseFormat.data = [true];
        res.send(responseFormat).status(200);
      }
    }
  );
};
