var mongoose = require("mongoose");
const Tweet = require("./Tweet");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, max: 36 },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  accessToken: { type: String, virtual: true },
  following : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("User", UserSchema);
