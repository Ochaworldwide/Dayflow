import { Bookmark, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function StatCards() {
  const { tasks, bookmarks } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      subtext: `${completionRate}% completion rate`,
      icon: ListTodo,
      iconClass:
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      label: 'Completed Tasks',
      value: completedTasks,
      subtext:
        completedTasks === 1 ? '1 task finished' : `${completedTasks} tasks finished`,
      icon: CheckCircle2,
      iconClass:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      subtext:
        pendingTasks === 0
          ? 'All caught up'
          : `${tasks.filter((t) => !t.completed && t.priority === 'high').length} high priority`,
      icon: Clock,
      iconClass:
        'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      label: 'Saved Bookmarks',
      value: bookmarks.length,
      subtext: `${new Set(bookmarks.map((b) => b.category)).size} categories`,
      icon: Bookmark,
      iconClass:
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
  ];

  return (
    <section aria-label="Productivity statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-150 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconClass}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              {stat.subtext}
            </p>
          </div>
        );
      })}
    </section>
  );
}

