import { Task, TimeEntry, Note } from '../types';

const STORAGE_KEYS = {
  TASKS: 'productivity_tasks',
  TIME_ENTRIES: 'productivity_time_entries',
  NOTES: 'productivity_notes',
};

export const storage = {
  tasks: {
    get: (): Task[] => {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    },
    set: (tasks: Task[]) => {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    },
  },
  timeEntries: {
    get: (): TimeEntry[] => {
      const data = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
      return data ? JSON.parse(data) : [];
    },
    set: (entries: TimeEntry[]) => {
      localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
    },
  },
  notes: {
    get: (): Note[] => {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    },
    set: (notes: Note[]) => {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    },
  },
};

