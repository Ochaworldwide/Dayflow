import { useState, type FormEvent } from 'react';
import { Check, Moon, RotateCcw, Sun, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export function Settings() {
  const {
    preferences,
    updatePreferences,
    setTheme,
    resetAllData,
    tasks,
    notes,
    bookmarks,
  } = useApp();

  const [displayName, setDisplayName] = useState(preferences.displayName);
  const [role, setRole] = useState(preferences.role);
  const [nameError, setNameError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setNameError('Display name cannot be empty.');
      return;
    }
    updatePreferences({
      displayName: displayName.trim(),
      role: role.trim(),
    });
    setNameError('');
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setDisplayName('Lazarus Gabriel');
    setRole('Software Engineer');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Customize your profile, appearance, and local workspace data.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize how DayFlow greets you across the dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="settings-display-name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="settings-display-name"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="Your name"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {nameError && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {nameError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="settings-role"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Role / Subtitle
              </label>
              <input
                id="settings-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Product Designer"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              Save Changes
            </button>
            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                Profile updated
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Appearance Section */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Appearance
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Choose between a crisp light workspace or a calm dark theme.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            aria-pressed={preferences.theme === 'light'}
            className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all ${
              preferences.theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/15 dark:border-indigo-500 dark:bg-indigo-950/30'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 shadow-2xs">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Light Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clean white surface with subtle contrast
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            aria-pressed={preferences.theme === 'dark'}
            className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all ${
              preferences.theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/15 dark:border-indigo-500 dark:bg-indigo-950/30'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-indigo-400 shadow-2xs">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Low-glare charcoal theme for late sessions
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Workspace Data
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            All your items are stored locally in your browser&apos;s LocalStorage.
          </p>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium text-slate-800 dark:text-slate-200">
              Current Local Storage Summary
            </p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {tasks.length} tasks · {notes.length} notes · {bookmarks.length}{' '}
              bookmarks
            </p>
          </div>

          <button
            type="button"
            onClick={() => setResetDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70 sm:self-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Application Data
          </button>
        </div>
      </section>

      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Application Data"
        message="This will restore the default sample tasks, notes, bookmarks, and preferences. Any custom changes you made will be overwritten."
        confirmLabel="Reset Data"
        variant="danger"
      />
    </div>
  );
}

