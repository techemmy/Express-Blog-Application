const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  renderFeedbackMessage,
  createToken,
  convertFormErrorObjToArr,
  maxAge,
} = require("../utilities");
const { validationResult } = require("express-validator");

// ROUTES HANDLER: register_get, user_create_post, login, user_login_post, user_logout_get

const register_get = async (req, res) => {
  res.render("./auth/register", { title: "Register" });
};

const user_create_post = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    // handles form validation error
    if (!errors.isEmpty()) {
      const errorsList = convertFormErrorObjToArr(errors.array());
      res.statusCode = 400;
      return renderFeedbackMessage(
        res,
        "./auth/register",
        "Register",
        errorsList,
        res.locals.user,
        "danger"
      );
    }

    const { username, email, password } = req.body;

    if (await User.findOne({ email })) {
      res.statusCode = 400;
      return renderFeedbackMessage(
        res,
        "./auth/register",
        "Register",
        ["User Already Exist. Create a new account."],
        res.locals.user,
        "danger"
      );
    }

    const user = await User.create({
      username: username,
      email: email, // sanitize
      password: password,
    });

    // Create authentication token
    const token = createToken(user._id, email);
    // save user authentication token
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    return res.redirect("/blogs");
  } catch (error) {
    res.statusCode = 400;
    error.message = "We couldn't authenticate your details.";
    next(error);
  }
};

const login_get = async (req, res) => {
  res.render("./auth/login", { title: "Login" });
};

const user_login_post = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // handles form validation error
    const errors = validationResult(req);
    const errorsList = convertFormErrorObjToArr(errors.array());
    if (!errors.isEmpty()) {
      res.statusCode = 400;
      return renderFeedbackMessage(
        res,
        "./auth/login",
        "Login",
        errorsList,
        res.locals.user,
        "danger"
      );
    }

    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.statusCode = 400;
      return renderFeedbackMessage(
        res,
        "./auth/login",
        "Login",
        ["User does not exist! Create an account!"],
        res.locals.user,
        "danger"
      );
    }

    const validPassword = await bcrypt.compare(password, userFound.password);
    if (!validPassword) {
      res.statusCode = 401;
      return renderFeedbackMessage(
        res,
        "./auth/login",
        "Login",
        ["Invalid password! Try again."],
        res.locals.user,
        "danger"
      );
    }

    token = createToken(userFound._id, userFound.email);
    // save user authentication token
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.redirect("/");
  } catch (error) {
    res.statusCode = 400;
    error.message("We couldn't log you in.")
    next(error);
  }
};

const user_logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  register_get,
  user_create_post,
  login_get,
  user_login_post,
  user_logout_get,
};
