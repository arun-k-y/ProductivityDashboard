export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  dueDate?: number;
}

export interface TimeEntry {
  id: string;
  taskId?: string;
  description: string;
  duration: number; // in seconds
  startTime: number;
  endTime: number;
  date: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

