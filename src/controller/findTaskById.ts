import { Router, type Request, type Response } from "express";
import { type Task } from "../types/task";
import { FindTaskById } from "../models/tasks";
import { param, Result, type ValidationError, validationResult, type ValidationChain } from "express-validator";
import type { ResponseHTTP, ResponseFindTaskById } from "../types/response";
import { ResponseJSONFunc } from "../lib/http";

const router = Router();

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *    summary: Retrieve details of a specific task by ID.
 *    tags: [Tasks]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Task ID
 *    responses:
 *      200:
 *        description: The task object.
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
  param("id").isNumeric().withMessage("id must be a number"),
]

router.get("/:id", validators, async (req: Request, res: Response) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: errors.array()
    }, 400);

    return;
  }

  const id: number = req.params.id as unknown as number;
  const taskOut: Task | null = await FindTaskById(id).then((task) => task).catch((err) => {
    console.log(err);
    return null;
  });

  if (!taskOut) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: "task not found"
    }, 400);
    return;
  }

  ResponseJSONFunc<ResponseFindTaskById>(res, {
    success: true,
    errors: null,
    task: taskOut
  }, 200);
});

export default router;