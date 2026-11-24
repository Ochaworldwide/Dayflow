import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type {
  Bookmark,
  BookmarkCategory,
  Note,
  Task,
  TaskPriority,
  ThemeMode,
  UserPreferences,
} from '../types';
import { generateId, normalizeUrl } from '../utils/dateUtils';
import {
  createInitialBookmarks,
  createInitialNotes,
  createInitialTasks,
  DEFAULT_PREFERENCES,
} from '../utils/sampleData';

export interface TaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

export interface NoteInput {
  title: string;
  content: string;
  pinned?: boolean;
}

export interface BookmarkInput {
  title: string;
  url: string;
  category: BookmarkCategory;
  description?: string;
}

interface AppContextValue {
  tasks: Task[];
  notes: Note[];
  bookmarks: Bookmark[];
  preferences: UserPreferences;
  addTask: (input: TaskInput) => Task;
  updateTask: (id: string, updates: Partial<TaskInput> & { completed?: boolean }) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addNote: (input: NoteInput) => Note;
  updateNote: (id: string, updates: Partial<NoteInput>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  addBookmark: (input: BookmarkInput) => Bookmark;
  updateBookmark: (id: string, updates: Partial<BookmarkInput>) => void;
  deleteBookmark: (id: string) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks, resetTasks] = useLocalStorage<Task[]>(
    'dayflow_tasks',
    createInitialTasks
  );
  const [notes, setNotes, resetNotes] = useLocalStorage<Note[]>(
    'dayflow_notes',
    createInitialNotes
  );
  const [bookmarks, setBookmarks, resetBookmarks] = useLocalStorage<Bookmark[]>(
    'dayflow_bookmarks',
    createInitialBookmarks
  );
  const [preferences, setPreferences, resetPreferences] =
    useLocalStorage<UserPreferences>('dayflow_preferences', DEFAULT_PREFERENCES);

  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  const addTask = useCallback(
    (input: TaskInput): Task => {
      const newTask: Task = {
        id: generateId(),
        title: input.title.trim(),
        description: input.description.trim(),
        priority: input.priority,
        dueDate: input.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<TaskInput> & { completed?: boolean }) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          const completed =
            updates.completed !== undefined ? updates.completed : task.completed;
          return {
            ...task,
            ...updates,
            title: updates.title !== undefined ? updates.title.trim() : task.title,
            description:
              updates.description !== undefined
                ? updates.description.trim()
                : task.description,
            completed,
            completedAt:
              updates.completed !== undefined
                ? completed
                  ? new Date().toISOString()
                  : undefined
                : task.completedAt,
          };
        })
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== id) return task;
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        })
      );
    },
    [setTasks]
  );

  const addNote = useCallback(
    (input: NoteInput): Note => {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: generateId(),
        title: input.title.trim() || 'Untitled Note',
        content: input.content.trim(),
        pinned: Boolean(input.pinned),
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    },
    [setNotes]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<NoteInput>) => {
      setNotes((prev) =>
        prev.map((note) => {
          if (note.id !== id) return note;
          return {
            ...note,
            title:
              updates.title !== undefined
                ? updates.title.trim() || 'Untitled Note'
                : note.title,
            content:
              updates.content !== undefined ? updates.content.trim() : note.content,
            pinned: updates.pinned !== undefined ? updates.pinned : note.pinned,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes]
  );

  const togglePinNote = useCallback(
    (id: string) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
            : note
        )
      );
    },
    [setNotes]
  );

  const addBookmark = useCallback(
    (input: BookmarkInput): Bookmark => {
      const newBookmark: Bookmark = {
        id: generateId(),
        title: input.title.trim(),
        url: normalizeUrl(input.url),
        category: input.category,
        description: input.description?.trim() || '',
        createdAt: new Date().toISOString(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
      return newBookmark;
    },
    [setBookmarks]
  );

  const updateBookmark = useCallback(
    (id: string, updates: Partial<BookmarkInput>) => {
      setBookmarks((prev) =>
        prev.map((bm) => {
          if (bm.id !== id) return bm;
          return {
            ...bm,
            title: updates.title !== undefined ? updates.title.trim() : bm.title,
            url: updates.url !== undefined ? normalizeUrl(updates.url) : bm.url,
            category: updates.category ?? bm.category,
            description:
              updates.description !== undefined
                ? updates.description.trim()
                : bm.description,
          };
        })
      );
    },
    [setBookmarks]
  );

  const deleteBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => prev.filter((bm) => bm.id !== id));
    },
    [setBookmarks]
  );

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...updates }));
    },
    [setPreferences]
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      setPreferences((prev) => ({ ...prev, theme }));
    },
    [setPreferences]
  );

  const toggleTheme = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, [setPreferences]);

  const toggleSidebar = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, [setPreferences]);

  const resetAllData = useCallback(() => {
    resetTasks();
    resetNotes();
    resetBookmarks();
    resetPreferences();
  }, [resetTasks, resetNotes, resetBookmarks, resetPreferences]);

  const value = useMemo<AppContextValue>(
    () => ({
      tasks,
      notes,
      bookmarks,
      preferences,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addNote,
      updateNote,
      deleteNote,
      togglePinNote,
      addBookmark,
      updateBookmark,
      deleteBookmark,
      updatePreferences,
      setTheme,
      toggleTheme,
      toggleSidebar,
      resetAllData,
    }),
    [
      tasks,
      notes,
      bookmarks,
      preferences,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addNote,
      updateNote,
      deleteNote,
      togglePinNote,
      addBookmark,
      updateBookmark,
      deleteBookmark,
      updatePreferences,
      setTheme,
      toggleTheme,
      toggleSidebar,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
