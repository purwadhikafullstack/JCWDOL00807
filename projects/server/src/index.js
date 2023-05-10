const { join } = require("path");
require('dotenv').config({path:join(__dirname,'../.env')});
const express = require("express");
const cors = require("cors");
// library express untuk membaca headers
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());

app.use(express.json());
app.use(bearerToken());
app.use("/", express.static(__dirname+"/Admin"));
app.use("/", express.static(__dirname+"/Public"));
// app.use(express.static("./Public"));
// app.use(express.static("./Admin"));
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

const {
  usersRouter,
  usersAddressRouter,
  rajaOngkirRouter,
  geoLocationRouter,
  adminRouter,
  categoriesProductRouter,
  discountRouter,
  cartRouter,
  userTransactionRouter,
} = require("./routes");

app.use("/api/user", usersRouter);
app.use("/api/user-address", usersAddressRouter);
app.use("/api/raja-ongkir", rajaOngkirRouter);
app.use("/api/geo-location", geoLocationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoriesProductRouter);
app.use("/api/discount", discountRouter);
app.use("/api/cart", cartRouter);
app.use("/api/transaction", userTransactionRouter);

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

app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
