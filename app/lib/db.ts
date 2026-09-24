import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "116.202.222.251",
  user: "cyberwar_user",
  password: "SiamSoad@@@",
  database: "cyberwar_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  ssl: {
    rejectUnauthorized: false
  }
});