const User = require("../models/user");
const Comment = require("../models/comment");
const { renderFeedbackMessage } = require("../utilities");
const bcrypt = require("bcryptjs");

// user_profile_get, edit_profile_get, edit_profile_post, user_comments, upload_profile_image_post

const profileImagePath = "/uploads/images";

const user_profile_get = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next();
    }

    const isCurrentUser = req.params.id == res.locals.user.id;

    if (isCurrentUser) {
      res.render("./user/profile", {
        title: "Profile Details",
        isCurrentUser,
        currentUser: res.locals.user,
        profileImagePath,
      });
    } else {
      res.render("./user/profile", {
        title: "Profile Details",
        isCurrentUser,
        currentUser: await User.findById(req.params.id),
        profileImagePath,
      });
    }
  } catch (error) {
    res.statusCode = 404;
    error.message = "Invalid user!";
    next(error);
  }
};

const edit_profile_get = async (req, res) => {
  res.render("./user/edit-profile", { title: "Edit Profile" });
};

const edit_profile_post = async (req, res, next) => {
  try {
    const feedbackMessages = [];
    const { username, oldPassword, newPassword } = req.body;

    if (!username && !oldPassword && !newPassword) {
      return res.redirect(req.originalUrl);
    }

    if (username === res.locals.user.username) {
      feedbackMessages.push("Try changing your username.");
    } else if (username) {
      await User.findByIdAndUpdate(res.locals.user._id, { username });
    }

    if ((!oldPassword && newPassword) || (oldPassword && !newPassword)) {
      feedbackMessages.push("Make sure the password fields are filled");
    } else if (oldPassword && newPassword && oldPassword == newPassword) {
      feedbackMessages.push("Try changing your password now.");
    } else if (oldPassword && newPassword) {
      const validPassword = await bcrypt.compare(
        oldPassword,
        res.locals.user.password
      );
      if (validPassword) {
        await User.findByIdAndUpdate(res.locals.user._id, {
          password: await bcrypt.hash(newPassword, 10),
        });
      } else {
        feedbackMessages.push("Invalid old password");
      }
    }

    if (feedbackMessages.length > 0) {
      console.log("here: ", feedbackMessages);
      res.statusCode = 403;
      return renderFeedbackMessage(
        res,
        "./user/edit-profile",
        "Edit Profile",
        feedbackMessages,
        res.locals.user,
        "danger"
      );
    } else {
      res.redirect(req.originalUrl);
    }
  } catch (error) {
    res.statusCode = 400;
    error.message = "We couldn't process your updates.";
    next(error);
  }
};

const user_comments_get = async (req, res, next) => {
  try {
    comments = await Comment.find({ user: res.locals.user._id })
      .populate("user")
      .populate("blog");
    res.render("comment", { title: "My comments", comments });
  } catch (error) {
    res.statusCode = 400;
    error.message = "We couldn't retrieve your comments.";
    next(error);
  }
};

const upload_profile_image_post = async (req, res, next) => {
  try {
    if (!req.file) {
      const isCurrentUser = req.params.id == res.locals.user.id;
      return renderFeedbackMessage(
        res,
        "./user/profile",
        "Profile Details",
        ["Choose a valid file."],
        res.locals.user,
        "danger",
        {
          isCurrentUser,
          currentUser: res.locals.user,
          profileImagePath,
        }
      );
    }

    await User.findByIdAndUpdate(res.locals.user._id, {
      profileImagePath: req.file.filename,
    });
    res.redirect(`/user/${res.locals.user._id}`);
  } catch (error) {
    res.statusCode = 400;
    error.message = "Invalid file type. Only images (.jpg, .jpeg, .png) are allowed."
    next(error);
  }
};

module.exports = {
  user_profile_get,
  edit_profile_get,
  edit_profile_post,
  user_comments_get,
  upload_profile_image_post,
};
