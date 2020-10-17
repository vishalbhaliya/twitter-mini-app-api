const uuid = require("uuid");
const generateToken = require("../libs/Authentication");
const UserModel = require("../models/User");
const mongoose = require("mongoose");

const responseFormat = {
  status: 200,
  message: "Success",
  data: [],
  error: null,
};

exports.login = async (req, res) => {
  const args = req.body;
  if (!args.email || !args.password) {
    res.status(400).send();
    return;
  }
  const user = await UserModel.findOne({ ...args, isDeleted: false });
  if (user) {
    const token = await generateToken();
    console.log("token ", token);
    user.accessToken = token.access_token;
    responseFormat.data = [user];
    res.send(responseFormat).status(200);
  } else {
    responseFormat.data = null;
    responseFormat.message = "No user found with this email. Try to signup";
    responseFormat.error = true;
    res.status(400).send(responseFormat);
  }
};

exports.signup = async (req, res) => {
  const user = req.body;
  user._id = mongoose.Types.ObjectId();
  const existUser = await UserModel.exists({ email: user.email });
  if (existUser) {
    responseFormat.data = null;
    responseFormat.message = "User already exist with this email.";
    responseFormat.error = true;
    res.status(400).send(responseFormat);
    return;
  }
  const userResp = await UserModel(user).save();
  if (userResp) {
    const token = await generateToken();
    console.log("token ", token.access_token, userResp);

    userResp.accessToken = token.access_token;
    responseFormat.data = [userResp];
    res.send(responseFormat).status(200);
  } else {
    responseFormat.data = null;
    responseFormat.message = "Something went wrong. Please try again later.";
    responseFormat.error = true;
    res.status(400).send(responseFormat);
  }
};

exports.follow = async (req, res) => {
  const args = req.body;
  const user = await UserModel.findOne({ _id: args.userId });
  const followUser = await UserModel.findOne({ _id: args.followId });
  if (user && followUser) {
    
    if (user.following) {
      followUser.following.push(user);
    } else {
      followUser.following = [user];
    }
    const userResp = await UserModel(followUser).save();
    if (userResp) {
      responseFormat.data = [userResp];
      res.send(responseFormat).status(200);
    } else {
      responseFormat.data = null;
      responseFormat.message = "Something went wrong. Please try again later.";
      responseFormat.error = true;
      res.status(400).send(responseFormat);
    }
  } else {
    responseFormat.data = null;
    responseFormat.message = "User not found";
    responseFormat.error = true;
    res.status(400).send(responseFormat);
    return;
  }
};

exports.getFollowing = async (req, res) => {
  const args = req.query.userId;
  const users = await UserModel.find({ following: { $in: [args] }, isDeleted: false });
  if (users) {
    responseFormat.data = users;
    res.send(responseFormat).status(200);
  } else {
    responseFormat.data = null;
    responseFormat.message = "No user found with this email. Try to signup";
    responseFormat.error = true;
    res.status(400).send(responseFormat);
  }
};