import { QueryError } from "mysql2";
import { MySQLConnection } from "../lib/mysql";
import type { Task } from "../types/task";
import { SafeString } from "../lib/string";

export function NewTask(taskIn: Task): Promise<Task | null> {
  return new Promise<Task | null>((resolve, reject) => {
    const query: string = `-- NewTask
      INSERT INTO tasks (title, description, due_date, status)
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

export function UpdateTaskById(taskIn: Task, id: number): Promise<Task | null> {
  return new Promise<Task | null>((resolve, reject) => {
    let toUpdate: string = "";
    if (taskIn.title) {
      toUpdate += `, title = ${SafeString(taskIn.title)}`;
    }
    if (taskIn.description) {
      toUpdate += `, description = ${SafeString(taskIn.description)}`;
    }
    if (taskIn.dueDate) {
      toUpdate += `, due_date = ${SafeString(taskIn.dueDate)}`;
    }
    if (taskIn.status) {
      toUpdate += `, status = ${SafeString(taskIn.status)}`;
    }

    const query: string = `-- UpdateTaskById
      UPDATE tasks
      SET updated_at = NOW() ${toUpdate}
      WHERE id = ${id}`

    console.log(query);
    MySQLConnection.query(query, [], (err: QueryError | null) => {
      if (err) reject(err);
    });

    MySQLConnection.query(`-- UpdateTaskById
      SELECT id, title, description, due_date, status, created_at, updated_at
      FROM tasks
      WHERE id = ${id}
    `, [], (err: QueryError | null, result: any) => {
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
    })
  })
}