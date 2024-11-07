import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import routes from "./controller";
import { mysqlInit } from "./lib/mysql";

dotenv.config();

// Connect to the database (MySQL)
mysqlInit();

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
 *      example:
 *        id: 1
 *        title: Task 1
 *        description: This is task 1
 *        dueDate: 2024-12-28
 *        status: pending
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

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/tasks", routes.RouteNewTask);
app.use("/tasks", routes.RouteUpdateTaskById);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})