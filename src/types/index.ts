export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilter = 'all' | 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type BookmarkCategory =
  | 'Work'
  | 'Design'
  | 'Development'
  | 'Reading'
  | 'Tools'
  | 'Personal';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: BookmarkCategory;
  description?: string;
  createdAt: string; // ISO string
}

export type ThemeMode = 'light' | 'dark';

export interface UserPreferences {
  displayName: string;
  role: string;
  theme: ThemeMode;
  sidebarCollapsed: boolean;
}

