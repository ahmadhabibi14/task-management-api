import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import routes from "./controller";
import { mysqlInit, mysqlDisconnect } from "./lib/mysql";
import { Server } from "http";
import { QueryError } from "mysql2";

dotenv.config();

mysqlInit((err: QueryError | null) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }

  console.log("📦 [database]: connected to MySQL");
});

const app: Express = express();
const port = process.env.WEB_PORT;

/**
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The auto-generated id of the task
 *        title:
 *          type: string
 *          description: The title of the task
 *        description:
 *          type: string
 *          description: The description of the task
 *        dueDate:
 *          type: string
 *          description: The due date of the task
 *        status:
 *          type: string
 *          description: The status of the task
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: The date and time when the task was created
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: The date and time when the task was last updated
 *        isDeleted:
 *          type: boolean
 *          description: Whether the task is deleted
 *      example:
 *        id: 1
 *        title: Task 1
 *        description: This is task 1
 *        dueDate: 2024-12-28
 *        status: pending
 *        createdAt: 2024-11-07T12:28:10.000Z
 *        updatedAt: 2024-11-07T12:28:10.000Z"
 *        isDeleted: false
 */
const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "A REST API for Task Management",
    },
  },

  apis: ["./src/**/*.ts"],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/tasks", routes.RouteNewTask);
app.use("/tasks", routes.RouteUpdateTaskById);
app.use("/tasks", routes.RouteFindTaskById);
app.use("/tasks", routes.RouteFindTasks);
app.use("/tasks", routes.RouteDeleteTaskById);

const server: Server = app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});

function shutdown() {
  console.log("🔌 [server]: Shutting down ...");

  mysqlDisconnect((err) => {
    if (err) {
      console.error("Error disconnecting from MySQL:", err);
      process.exit(1);
    }
  });

  server.close((err) => {
    if (err) {
      console.error("Error shutting down HTTP server:", err);
      process.exit(1);
    }
  });

  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);