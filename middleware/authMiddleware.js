const jwt = require("jsonwebtoken");
const User = require("../models/user");

const TOKEN_KEY = process.env.TOKEN_KEY;

// it checks if user is authenticated on every request
const verifyToken = async (req, res, next) => {

  try {
    const token = req.cookies.jwt;
    if (!token) {
      // return res.status(403).send("A token is required for authentication");
      return res.redirect("/auth/login");
    }

    jwt.verify(token, TOKEN_KEY);
    next()
  } catch (error) {
    res.redirect("/auth/login")
  }

};

// checks if user is authenticated and adds user to the request object
const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    res.locals.errors = null; // sets errors to null for authentication pages get requests e.g Login get request page
    const decodedToken = jwt.verify(token, TOKEN_KEY);
    if (decodedToken) {
      const user = await User.findById(decodedToken.user_id);
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }
    next()
  } catch (error) {
      res.locals.user = null;
      next();
  }
};

module.exports = { verifyToken, checkUser };
