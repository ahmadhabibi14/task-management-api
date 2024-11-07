import { Task } from "./task";

export interface ResponseHTTP {
  success: boolean;
  errors: any;
}

export interface ResponseNewTask extends ResponseHTTP {
  task: Task
}