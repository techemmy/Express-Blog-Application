const app = require("./app");
const mongoose = require("mongoose");

// configure app port
const { API_PORT } = process.env;
const PORT = process.env.PORT || API_PORT;

// connect to mongodb
const dbURI = process.env.dbURI;
mongoose.connect(dbURI, (error) => {
  if (!error) {
    console.log("db connected successfully!");
  } else {
    console.log("An error occured: ", error);
  }
})

app.listen(PORT, () => {
    console.log("server started successfully!")
  });
