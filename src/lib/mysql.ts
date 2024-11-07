import { type Connection, createConnection } from "mysql2";

export let MySQLConnection: Connection;

export function mysqlConnect(): Promise<Connection> {
  return new Promise((resolve, reject) => {
    if (MySQLConnection) {
      resolve(MySQLConnection);
    } else {
      MySQLConnection = createConnection({
        host: "127.0.0.1",
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE,
        multipleStatements: true
      });

      MySQLConnection.connect((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Connected to MySQL!");
          resolve(MySQLConnection);
        }
      });
    }
  });
}

export function mysqlDisconnect(): void {
  console.log("Disconnected from MySQL!");
  MySQLConnection.end();
}

export function mysqlInit(): void {
  mysqlConnect();
}