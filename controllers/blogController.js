const Blog = require("../models/blog");
const BlogLabel = require("../models/blogLabel");
const Comment = require("../models/comment");
const User = require("../models/user");
const { validationResult } = require("express-validator");
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const blog_index = async (req, res, next) => {
  try {
    blogs = await Blog.find().populate("labels").sort({ createdAt: -1 });
    res.render("blogs/index", { title: "All Blogs", blogs });
  } catch (error) {
    next(error);
  }
};

const blog_details = async (req, res, next) => {
  try {
    const id = req.params.id;
    blog = await Blog.findById(id).populate("labels");
    comments = await Comment.find({ blog: blog.id }).populate("user");
    res.render("blogs/details", { blog, title: "Blog Details", comments });
  } catch (error) {
    next(error);
  }
};

const blog_create_get = async (req, res, next) => {
  try {
    errors = validationResult(req);
    blogLabels = await BlogLabel.find();
    res.render("blogs/create", {
      title: "Create a new blog",
      labels: blogLabels,
    });
  } catch (error) {
    next(error);
  }
};

const blog_create_post = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res.redirect("/auth/login");
    }

    const labels = req.body.label; // The output can either be a string of label or list of labels
    let labelsList = [];

    if (typeof labels === "string") {
      labelsList.push(labels);
    } else if (typeof labels === "object") {
      labelsList = labels;
    }

    blog = await Blog.create({
      ...req.body,
      createdBy: res.locals.user._id,
      labels: labelsList,
    });
    await User.findByIdAndUpdate(res.locals.user._id, {
      $push: { blogs: blog._id },
    });

    res.redirect("/blogs");
  } catch (error) {
    next(error);
  }
};

const blog_delete = async (req, res, next) => {
  try {
    const id = req.params.id;

    await Blog.findByIdAndDelete(id);
    res.json({ redirect: "/blogs" });
  } catch (error) {
    next(error);
  }
};

const blog_add_comment = async (req, res, next) => {
  try {
    const blog_id = req.params.id;

    blog = await Blog.findById(blog_id);
    comment = await Comment.create({
      ...req.body,
      ...{ user: res.locals.user._id, blog: blog._id },
    });
    // await User.findByIdAndUpdate(res.locals.user._id, {$push: {comments: comment._id}})
    blog.comments.push(comment._id);
    await blog.save();
    res.redirect(req.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
  blog_add_comment,
};
