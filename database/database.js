const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables

// Create MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "s2p00y00@gmail.com",
  database: process.env.DB_NAME || "voting_system",
});


module.exports = db;
