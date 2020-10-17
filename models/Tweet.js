var mongoose = require("mongoose");
var TweetSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, max: 36, },
  tweet: { type: String, required: true, max: 140 },
  userId: { type: String, required: true, max: 36 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Export the model
module.exports = mongoose.model("Tweet", TweetSchema);
