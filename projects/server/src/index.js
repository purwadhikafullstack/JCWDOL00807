require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
// library express untuk membaca headers
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    // origin: [
    //   process.env.WHITELISTED_DOMAIN &&
    //     process.env.WHITELISTED_DOMAIN.split(","),
    // ],
  })
);

app.use(express.json());
app.use(bearerToken());
// Synchronize models Sequelize
// const Sequelize = require("sequelize");
// const Models = require("./models");
// Models.sequelize
//   .sync({
//     force: false,
//     alter: true,
//     logging: console.log,
//   })
//   .then(function () {
//     console.log("Database is Synchronized!");
//   })
//   .catch(function (err) {
//     console.log(err, "Something Went Wrong with Database Update!");
//   });

//#region API ROUTES

// ===========================
// NOTE : Add your routes here
const { usersRouter, adminRouter } = require("./routes");
app.use("/api/user", usersRouter);
app.use("/api/admin", adminRouter);

//# add Router

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});
app.use("/api/users", usersRouter);
// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use("/static", express.static(join(__dirname, "public")));
app.use(express.static("./public"));

app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
// app.get("*", (req, res) => {
//   res.sendFile(join(__dirname, clientPath, "index.html"));
// });

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
