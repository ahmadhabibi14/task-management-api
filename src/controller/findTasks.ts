import { Router, type Request, type Response } from "express";
import { type Task } from "../types/task";
import { FindTasks } from "../models/tasks";
import { query, Result, type ValidationError, validationResult, type ValidationChain } from "express-validator";
import type { ResponseHTTP, ResponseFindTasks } from "../types/response";
import { ResponseJSONFunc } from "../lib/http";

const router = Router();

/**
 * @swagger
 * /tasks:
 *  get:
 *    summary: Retrieve a list of all tasks
 *    tags: [Tasks]
 *    parameters:
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *        description: Task status
 *      - in: query
 *        name: dueDate
 *        schema:
 *          type: string
 *        description: Due date in YYYY-MM-DD format
 *    responses:
 *      200:
 *        description: An array of tasks matching the filters, if provided
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                tasks:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Task"
 */

const validators: ValidationChain[] = [
  query("status").optional().isString(),
  query("dueDate").optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("dueDate must be in YYYY-MM-DD format")
    .custom((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .withMessage("dueDate must be a valid date"),
]

router.get("/", validators, async (req: Request, res: Response) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: errors.array()
    }, 400);

    return;
  }

  const tasks: Task[] = await FindTasks(req.query.status as string, req.query.dueDate as string).then((task) => task).catch((err) => {
    console.log(err);
    return [] as Task[];
  });

  ResponseJSONFunc<ResponseFindTasks>(res, {
    success: true,
    errors: null,
    tasks: tasks
  }, 200);
});

export default router;