export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};