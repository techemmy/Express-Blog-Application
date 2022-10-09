const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const process = require("process");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")

// local imports
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoute");
const { verifyToken, checkUser } = require("./middleware/authMiddleware");
const { unless } = require("./utilities");

// express app
const app = express();

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));
app.use(cookieParser());

// routes
app.use("*", checkUser);
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// excludes these routes from authentication
app.use(unless(verifyToken, ["/auth/login", "/auth/register", "/blogs"]));

// user auth routes
app.use("/auth", authRoutes);

// user profile routes
app.use("/user", userRoutes);

// blog routes
app.use("/blogs", blogRoutes);

app.use((error, req, res, next) => {
  console.log("Error Handler: ", error.message, error);
  if (error.message) {
    return res.render("404.ejs", { title: "404", message: error.message });
  }

  next();
})

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404", message: null });
});

module.exports = app;