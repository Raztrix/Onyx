// src/types/index.ts

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TaskTag {
  taskId: number;
  tagId: number;
  tag?: Tag;
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO Date string
  priority: 'Low' | 'Medium' | 'High';
  isReminderSent: boolean;
  userId: number;
  user?: User;
  taskTags: TaskTag[];
  isCompleted: boolean;
}
