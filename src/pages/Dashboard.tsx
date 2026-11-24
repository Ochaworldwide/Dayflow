import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatFullDate, getTimeGreeting } from '../utils/dateUtils';
import { StatCards } from '../components/dashboard/StatCards';
import { TodayTasksWidget } from '../components/dashboard/TodayTasksWidget';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { QuickNotesWidget } from '../components/dashboard/QuickNotesWidget';
import { QuickLinksWidget } from '../components/dashboard/QuickLinksWidget';
import { TaskFormModal } from '../components/tasks/TaskFormModal';

export function Dashboard() {
  const { preferences, addTask } = useApp();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const greeting = getTimeGreeting();
  const firstName = preferences.displayName.trim().split(/\s+/)[0] || 'there';
  const todayFormatted = formatFullDate();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {greeting}, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ready to make today productive? Here&apos;s an overview of your day.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTaskModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </section>

      {/* Statistics Cards */}
      <StatCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          <TodayTasksWidget />
          <ProductivityChart />
        </div>
        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          <QuickNotesWidget />
          <QuickLinksWidget />
        </div>
      </div>

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={(data) => addTask(data)}
      />
    </div>
  );
}

