import { type Connection, createConnection, QueryError } from "mysql2";

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

export function mysqlDisconnect(callback: (err: QueryError | null) => void): void {
  MySQLConnection.end(callback);
}

export function mysqlInit(): void {
  mysqlConnect().catch((err) => {
    console.log(err);
    process.exit(1);
  });
}