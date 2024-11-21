import mysql from "mysql2/promise";

let connection;

export const connectToDatabase = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.JWT_HOST,
        user: process.env.JWT_USER,
        password: process.env.JWT_PASS,
        database: process.env.JWT_DB,
      });
    }
    return connection;
  } catch (err) {
    console.log(err);
  }
};
