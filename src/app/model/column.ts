export interface Column {
  id?: string;
  title: string;
  createdAt?: string;
  boardId: string;
  userId: string | undefined;
}
