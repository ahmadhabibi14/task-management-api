import { Router, type Request, type Response } from "express";
import { type Task } from "../types/task";
import { UpdateTaskById } from "../models/tasks";
import { body, param, Result, type ValidationError, validationResult, type ValidationChain } from "express-validator";
import type { ResponseHTTP, ResponseUpdateTaskById } from "../types/response";
import { ResponseJSONFunc } from "../lib/http";

const router = Router();

/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    summary: Update a specific task's details.
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Task ID
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
  param("id").isNumeric().withMessage("id must be a number").optional(),
  body("title").isString().withMessage("title must be a string").optional(),
  body("description").isString().withMessage("description must be a string").optional(),
  body("dueDate").optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("dueDate must be in YYYY-MM-DD format")
    .custom((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .withMessage("dueDate must be a valid date"),
  body("status").isString().withMessage("status must be a string").optional()
]

router.put("/:id", validators, async (req: Request, res: Response) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: errors.array()
    }, 400);

    return;
  }

  const id: number = req.params.id as unknown as number;
  const taskIn: Task = req.body as Task;
  const taskOut: Task | null = await UpdateTaskById(taskIn, id).then((task) => task).catch((err) => {
    console.log(err);
    return null;
  });

  if (!taskOut) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: "error updating task"
    }, 400);
    return;
  }

  ResponseJSONFunc<ResponseUpdateTaskById>(res, {
    success: true,
    errors: null,
    task: taskOut
  }, 200);
});

export default router;