import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export function ProductivityChart() {
  const { tasks, preferences } = useApp();
  const isDark = preferences.theme === 'dark';

  const chartData = useMemo(() => {
    const priorities: Array<{ key: 'high' | 'medium' | 'low'; label: string }> = [
      { key: 'high', label: 'High' },
      { key: 'medium', label: 'Medium' },
      { key: 'low', label: 'Low' },
    ];

    return priorities.map(({ key, label }) => {
      const group = tasks.filter((t) => t.priority === key);
      const completed = group.filter((t) => t.completed).length;
      const pending = group.length - completed;
      return {
        priority: label,
        Completed: completed,
        Pending: pending,
      };
    });
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Task Breakdown by Priority
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Completed vs. pending tasks across priority levels
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-indigo-500" />
            Completed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
            Pending
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            Overall Progress
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {progress}%
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-5 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
            barGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="priority"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.7)' }}
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '12px',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
            />
            <Bar
              dataKey="Completed"
              fill={isDark ? '#6366f1' : '#4f46e5'}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="Pending"
              fill={isDark ? '#334155' : '#cbd5e1'}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

