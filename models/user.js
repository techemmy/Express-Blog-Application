const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: [true, "This email is being used by another user"],
  },
  password: {
    type: String,
    required: [true, "Password field is required!"],
  },
  profileImagePath : {
    type: String,
    default: null
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Comment",
  //   },
  // ],
});

UserSchema.pre("save", async function (next) {
  // Encrypt user password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
