import { QueryError } from "mysql2";
import { MySQLConnection } from "../lib/mysql";
import type { Task } from "../types/task";

export function NewTask(taskIn: Task): Promise<Task | null> {
  return new Promise<Task | null>((resolve, reject) => {
    const query: string = `INSERT INTO tasks (title, description, due_date, status)
      VALUES(?, ?, ?, ?)
      RETURNING id, title, description, due_date, status, created_at, updated_at`

    MySQLConnection.query(query, [ taskIn.title, taskIn.description, taskIn.dueDate, taskIn.status ],
      (err: QueryError | null, result: any) => {
        if (err) {
          reject(err);
        } else {
          if (result && result.length > 0) {
            const rawTask: any = result[0];
            const task: Task = {
              id: rawTask.id,
              title: rawTask.title,
              description: rawTask.description,
              dueDate: rawTask.due_date,
              status: rawTask.status,
              createdAt: rawTask.created_at,
              updatedAt: rawTask.updated_at
            }
            resolve(task);
          } else {
            resolve(null);
          }
        }
      }
    );
  })
}