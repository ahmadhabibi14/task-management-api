import { type Connection, createConnection, QueryError } from "mysql2";

export let MySQLConnection: Connection;

export function mysqlInit(callback: (err: QueryError | null) => void): void {
  if (MySQLConnection) {
    return callback(null);
  }
  
  MySQLConnection = createConnection({
    host: "127.0.0.1",
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    multipleStatements: true
  });

  MySQLConnection.connect(callback);
}

export function mysqlDisconnect(callback: (err: QueryError | null) => void): void {
  MySQLConnection.end(callback);
}