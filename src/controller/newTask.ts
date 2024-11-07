import { Router, type Request, type Response } from "express";
import { type Task } from "../types/task";
import { NewTask } from "../models/tasks";
import { body, Result, type ValidationError, validationResult, type ValidationChain } from "express-validator";
import type { ResponseHTTP, ResponseNewTask } from "../types/response";
import { ResponseJSONFunc } from "../lib/http";

const router = Router();

/**
 * @swagger
 * /tasks:
 *  post:
 *    summary: Create a new task
 *    tags: [Tasks]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Task title
 *              description:
 *                type: string
 *                description: Task description
 *              dueDate:
 *                type: string
 *                description: YYYY-MM-DD
 *              status:
 *                type: string
 *                description: Task status (pending, in-progress, completed, etc..)
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                task:
 *                  type: object
 *                  $ref: "#/components/schemas/Task"
 */

const validators: ValidationChain[] = [
  body("title").notEmpty().withMessage("title is required"),
  body("description").notEmpty().withMessage("description is required"),
  body("dueDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("dueDate must be in YYYY-MM-DD format")
    .custom((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .withMessage("dueDate must be a valid date"),
  body("status").notEmpty().withMessage("status is required")
]

router.post("/", validators, async (req: Request, res: Response) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: errors.array()
    }, 400);

    return;
  }

  const taskIn: Task = req.body as Task;
  const taskOut: Task | null = await NewTask(taskIn).then((task) => task).catch((err) => {
    console.log(err);
    return null;
  });

  if (!taskOut) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: "error creating task"
    }, 400);
    return;
  }

  ResponseJSONFunc<ResponseNewTask>(res, {
    success: true,
    errors: null,
    task: taskOut
  }, 200);
});

export default router;