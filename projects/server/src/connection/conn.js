const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "purwadhikabootcamp.com",
  user: "jcwdol0807",
  password: "jcwdol0807123",
  database: "jcwdol0807",
});

db.connect((err) => {
  if (err) return console.log("Error " + err.message);

  console.log("Connected to Database");
});

module.exports = db;
