export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  reminderDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  comments: Comment[];
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface ProjectData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}
