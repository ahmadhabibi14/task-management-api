import { Router, type Request, type Response } from "express";
import { type Task } from "../types/task";
import { DeleteTaskById } from "../models/tasks";
import { param, Result, type ValidationError, validationResult, type ValidationChain } from "express-validator";
import type { ResponseHTTP, ResponseUpdateTaskById } from "../types/response";
import { ResponseJSONFunc } from "../lib/http";

const router = Router();

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *    summary: Delete a task by ID.
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
 *        description: A deleted task object.
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
  param("id").isNumeric().withMessage("id must be a number").notEmpty().withMessage("id is required"),
]

router.delete("/:id", validators, async (req: Request, res: Response) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: errors.array()
    }, 400);

    return;
  }

  const id: number = req.params.id as unknown as number;
  const taskOut: Task | null = await DeleteTaskById(id).then((task) => task).catch((err) => {
    console.log(err);
    return null;
  });

  if (!taskOut) {
    ResponseJSONFunc<ResponseHTTP>(res, {
      success: false,
      errors: "error deleting task"
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