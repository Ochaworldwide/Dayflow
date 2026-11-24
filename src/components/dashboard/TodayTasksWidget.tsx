import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Check,
  CheckSquare,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Task, TaskFilter } from '../../types';
import { formatShortDate, isOverdue } from '../../utils/dateUtils';
import { PriorityBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { TaskFormModal } from '../tasks/TaskFormModal';

const FILTER_TABS: Array<{ id: TaskFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

export function TodayTasksWidget() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useApp();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  }, [tasks, filter]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Today&apos;s Tasks
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Stay focused on your highest-priority work
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5 dark:border-slate-800">
        <div
          className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800"
          role="tablist"
          aria-label="Filter tasks"
        >
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Task List */}
      <div className="p-4">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            compact
            title={
              filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'pending'
                  ? 'All tasks completed'
                  : 'No tasks yet'
            }
            description={
              filter === 'pending'
                ? 'Great job! Add a new task whenever something comes up.'
                : 'Create your first task to start organizing your day.'
            }
            action={
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Task
              </button>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTasks.slice(0, 6).map((task) => {
              const overdue = isOverdue(task.dueDate, task.completed);
              return (
                <li
                  key={task.id}
                  className="group flex items-start gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? `Mark "${task.title}" as pending`
                        : `Mark "${task.title}" as completed`
                    }
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      task.completed
                        ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                        : 'border-slate-300 bg-white hover:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-indigo-400'
                    }`}
                  >
                    {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'text-slate-400 line-through dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    {task.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          overdue
                            ? 'font-medium text-rose-600 dark:text-rose-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        {overdue
                          ? `Overdue · ${formatShortDate(task.dueDate)}`
                          : formatShortDate(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(task)}
                      aria-label={`Edit "${task.title}"`}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete "${task.title}"`}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTask={editingTask}
        onSubmit={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
          } else {
            addTask(data);
          }
        }}
      />
    </section>
  );
}

