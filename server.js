const app = require("./app");

// configure app port
const { API_PORT } = process.env;
const PORT = process.env.PORT || API_PORT;

app.listen(PORT, () => {
    console.log("server started successfully!")
  });
