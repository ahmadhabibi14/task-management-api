import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.WEB_PORT;

app.get("/", (req: Request, res: Response) => {
  res.header("Content-Type", "text/plain");
  res.send("Hello world !!");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})