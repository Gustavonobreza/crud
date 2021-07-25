const express = require("express");
const cors = require("cors");
const { usersRoute, postsRoute } = require("./routes");

require("express-async-errors");

const app = express();

app.use(express.json());
app.use("/users", usersRoute);
app.use("/posts", postsRoute);

app.use((err, req, res, next) => {
  if (err && err.statusCode) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
    console.log("🚧", err.message);
    return null;
  }
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
  });
  console.log("🚧", err);
});

module.exports = app;
