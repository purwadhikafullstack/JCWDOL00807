const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "jcwdol0807",
  password: "ROBIMETAL42279",
  database: "online_groceries2",
});

db.connect((err) => {
  if (err) return console.log("Error " + err.message);

  console.log("Connected to Database");
});

module.exports = db;
