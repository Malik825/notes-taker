// note.model.ts
export interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}
