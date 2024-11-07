import { Task } from "./task";

export interface ResponseHTTP {
  success: boolean;
  errors: any;
}

export interface ResponseNewTask extends ResponseHTTP {
  task: Task
}

export interface ResponseUpdateTaskById extends ResponseHTTP {
  task: Task
}

export interface ResponseFindTaskById extends ResponseHTTP {
  task: Task
}

export interface ResponseFindTasks extends ResponseHTTP {
  tasks: Task[]
}

export interface ResponseDeleteTaskById extends ResponseHTTP {
  task: Task
}