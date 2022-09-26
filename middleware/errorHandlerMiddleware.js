const errorHandler = (error, req, res, next) => {
  console.log("Error Handler: ", error.message, error);
  if (error.message) {
    return res.render("404.ejs", { title: "404", message: error.message });
  }

  next();
};

module.exports = errorHandler;
