import { QueryError } from "mysql2";
import { MySQLConnection } from "../lib/mysql";
import type { Task } from "../types/task";
import { SafeString } from "../lib/string";

export function NewTask(taskIn: Task): Promise<Task | null> {
  return new Promise<Task | null>((resolve, reject) => {
    const query: string = `-- NewTask
      INSERT INTO tasks (title, description, due_date, status)
      VALUES(?, ?, ?, ?)
      RETURNING id, title, description, due_date, status, created_at, updated_at
    `
    console.log(query);
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
              updatedAt: rawTask.updated_at,
              isDeleted: false
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
      WHERE id = ?`
    console.log(query);
    MySQLConnection.query(query, [id], (err: QueryError | null) => {
      if (err) reject(err);
    });

    const query2: string = `-- UpdateTaskById
      SELECT id, title, description, due_date, status, created_at, updated_at, is_deleted
      FROM tasks
      WHERE id = ?
    `
    console.log(query2); 
    MySQLConnection.query(query2, [id], (err: QueryError | null, result: any) => {
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
            updatedAt: rawTask.updated_at,
            isDeleted: rawTask.is_deleted === 0 ? false : true
          }
          resolve(task);
        } else {
          resolve(null);
        }
      }
    })
  })
}

export function FindTaskById(id: number): Promise<Task | null> {
  return new Promise<Task | null>((resolve, reject) => {
    const query: string = `-- FindTaskById
      SELECT id, title, description, due_date, status, created_at, updated_at, is_deleted
      FROM tasks
      WHERE id = ?
    `
    console.log(query);
    MySQLConnection.query(query, [id], (err: QueryError | null, result: any) => {
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
            updatedAt: rawTask.updated_at,
            isDeleted: rawTask.is_deleted === 0 ? false : true
          }
          resolve(task);
        } else {
          resolve(null);
        }
      }
    })
  })
}

export function FindTasks(status: string, dueDate: string): Promise<Task[]> {
  return new Promise<Task[]>((resolve, reject) => {
    if (!status || status === "") {
      status = "pending"; // default to pending
    }

    if (!dueDate || dueDate === "") {
      const today: Date = new Date();
      dueDate = today.toISOString().split('T')[0]; // default to today
    }
    const query: string = `-- FindTasks
      SELECT id, title, description, due_date, status, created_at, updated_at, is_deleted
      FROM tasks
      WHERE status = ? AND due_date = ?
    `
    console.log(query);
    MySQLConnection.query(query, [status, dueDate], (err: QueryError | null, result: any) => {
      if (err) {
        reject(err);
      } else {
        if (!result || result.length === 0) {
          resolve([] as Task[]);
        }
        const tasks: Task[] = result.map((task: any) => {
          return {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.due_date,
            status: task.status,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            isDeleted: task.is_deleted === 0 ? false : true
          }
        })
        resolve(tasks);
      }
    });
  });
}

export function DeleteTaskById(id: number): Promise<Task | null> {
  return new Promise<Task | null>((resolve, reject) => {
    const query: string = `-- DeleteTaskById
      UPDATE tasks
      SET updated_at = NOW(), is_deleted = 1
      WHERE id = ?`
    console.log(query);
    MySQLConnection.query(query, [id], (err: QueryError | null) => {
      if (err) reject(err);
    });

    const query2: string = `-- DeleteTaskById
      SELECT id, title, description, due_date, status, created_at, updated_at, is_deleted
      FROM tasks
      WHERE id = ?
    `
    console.log(query2); 
    MySQLConnection.query(query2, [id], (err: QueryError | null, result: any) => {
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
            updatedAt: rawTask.updated_at,
            isDeleted: rawTask.is_deleted === 0 ? false : true
          }
          resolve(task);
        } else {
          resolve(null);
        }
      }
    })
  })
}