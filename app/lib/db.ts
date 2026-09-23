import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "cyber-warriors.xyz", // বা আপনার cPanel Shared IP / localhost
  user: "cyberwar_user",
  password: "SiamSoad@@@",
  database: "cyberwar_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});