export interface Task {
  id?: string;
  title: string;
  description?: string;
  createdAt?: Date;
  userId: string | undefined;
  boardId: string;
  columnId: string | undefined;
}
