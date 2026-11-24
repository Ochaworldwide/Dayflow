import type { Bookmark, BookmarkCategory, Note, Task, UserPreferences } from '../types';
import { getOffsetDateISO, getTodayISO } from './dateUtils';

export const BOOKMARK_CATEGORIES: BookmarkCategory[] = [
  'Work',
  'Development',
  'Design',
  'Tools',
  'Reading',
  'Personal',
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  displayName: 'Lazarus Gabriel',
  role: 'Software Engineer',
  theme: 'light',
  sidebarCollapsed: false,
};

export function createInitialTasks(): Task[] {
  const today = getTodayISO();
  const now = Date.now();

  return [
    {
      id: 'task-1',
      title: 'Finalize Q4 product roadmap deck',
      description: 'Review milestone timelines with design and engineering leads before afternoon sync.',
      priority: 'high',
      dueDate: today,
      completed: false,
      createdAt: new Date(now - 3600 * 1000 * 5).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Audit dashboard accessibility & keyboard navigation',
      description: 'Verify focus traps in modals, ARIA labels on icon buttons, and WCAG AA contrast ratios.',
      priority: 'high',
      dueDate: today,
      completed: true,
      createdAt: new Date(now - 3600 * 1000 * 24).toISOString(),
      completedAt: new Date(now - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Write API integration specs for webhooks',
      description: 'Document retry backoff strategy, payload signature verification, and error codes.',
      priority: 'medium',
      dueDate: getOffsetDateISO(1),
      completed: false,
      createdAt: new Date(now - 3600 * 1000 * 18).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Review pull requests for analytics module',
      description: 'Check chart responsiveness and TypeScript strict-mode compliance.',
      priority: 'medium',
      dueDate: today,
      completed: true,
      createdAt: new Date(now - 3600 * 1000 * 30).toISOString(),
      completedAt: new Date(now - 3600 * 1000 * 4).toISOString(),
    },
    {
      id: 'task-5',
      title: 'Organize weekly team retro notes',
      description: 'Summarize action items and share follow-ups in the engineering channel.',
      priority: 'low',
      dueDate: getOffsetDateISO(2),
      completed: false,
      createdAt: new Date(now - 3600 * 1000 * 48).toISOString(),
    },
    {
      id: 'task-6',
      title: 'Update personal learning reading list',
      description: 'Curate articles on React 19 patterns and distributed systems.',
      priority: 'low',
      dueDate: getOffsetDateISO(-1),
      completed: true,
      createdAt: new Date(now - 3600 * 1000 * 72).toISOString(),
      completedAt: new Date(now - 3600 * 1000 * 26).toISOString(),
    },
  ];
}

export function createInitialNotes(): Note[] {
  const now = Date.now();

  return [
    {
      id: 'note-1',
      title: 'Weekly Focus Priorities',
      content:
        '1. Ship the redesigned analytics overview\n2. Keep PR review turnaround under 4 hours\n3. Block 2 hours every morning for deep work before checking messages.',
      pinned: true,
      createdAt: new Date(now - 3600 * 1000 * 48).toISOString(),
      updatedAt: new Date(now - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: 'note-2',
      title: 'Design System Polish Checklist',
      content:
        'Keep surface hierarchy crisp: subtle slate-200 borders in light mode, slate-800 in dark mode. Reserve indigo accent strictly for primary actions and active navigation states.',
      pinned: true,
      createdAt: new Date(now - 3600 * 1000 * 36).toISOString(),
      updatedAt: new Date(now - 3600 * 1000 * 6).toISOString(),
    },
    {
      id: 'note-3',
      title: '1:1 Sync Talking Points',
      content:
        'Discuss Q4 staffing needs, upcoming release calendar, and ideas for reducing CI build times by caching workspace dependencies.',
      pinned: false,
      createdAt: new Date(now - 3600 * 1000 * 20).toISOString(),
      updatedAt: new Date(now - 3600 * 1000 * 14).toISOString(),
    },
    {
      id: 'note-4',
      title: 'Book Excerpt — Deep Work',
      content:
        'Clarity about what matters provides clarity about what does not. Schedule every block of your day intentionally to protect cognitive bandwidth.',
      pinned: false,
      createdAt: new Date(now - 3600 * 1000 * 96).toISOString(),
      updatedAt: new Date(now - 3600 * 1000 * 72).toISOString(),
    },
  ];
}

export function createInitialBookmarks(): Bookmark[] {
  const now = Date.now();

  return [
    {
      id: 'bm-1',
      title: 'React Documentation',
      url: 'https://react.dev',
      category: 'Development',
      description: 'Official React docs, hooks reference, and architecture guides.',
      createdAt: new Date(now - 3600 * 1000 * 120).toISOString(),
    },
    {
      id: 'bm-2',
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com/docs',
      category: 'Design',
      description: 'Utility-first CSS framework documentation and token reference.',
      createdAt: new Date(now - 3600 * 1000 * 96).toISOString(),
    },
    {
      id: 'bm-3',
      title: 'Linear Method',
      url: 'https://linear.app/method',
      category: 'Work',
      description: 'Principles and practices for modern software product teams.',
      createdAt: new Date(now - 3600 * 1000 * 72).toISOString(),
    },
    {
      id: 'bm-4',
      title: 'Lucide Icons',
      url: 'https://lucide.dev/icons',
      category: 'Design',
      description: 'Clean, consistent open-source icon library for React.',
      createdAt: new Date(now - 3600 * 1000 * 48).toISOString(),
    },
    {
      id: 'bm-5',
      title: 'TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/',
      category: 'Development',
      description: 'Type system reference, generics, and utility types.',
      createdAt: new Date(now - 3600 * 1000 * 24).toISOString(),
    },
    {
      id: 'bm-6',
      title: 'Excalidraw',
      url: 'https://excalidraw.com',
      category: 'Tools',
      description: 'Virtual whiteboard for sketching architecture diagrams.',
      createdAt: new Date(now - 3600 * 1000 * 12).toISOString(),
    },
  ];
}

