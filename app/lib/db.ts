import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "116.202.222.251", // Apnar cPanel Shared IP Address
  user: "cyberwar_user",
  password: "SiamSoad@@@",
  database: "cyberwar_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});