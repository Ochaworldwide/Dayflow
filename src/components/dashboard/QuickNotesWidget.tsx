import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Pencil,
  Pin,
  Plus,
  StickyNote,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Note } from '../../types';
import { formatRelativeTime } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';
import { NoteFormModal } from '../notes/NoteFormModal';

export function QuickNotesWidget() {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useApp();
  const [quickText, setQuickText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes]);

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    const lines = quickText.trim().split('\n');
    const title = lines[0].slice(0, 60);
    const content = lines.length > 1 ? lines.slice(1).join('\n') : quickText.trim();
    addNote({ title, content, pinned: false });
    setQuickText('');
  };

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Quick Notes
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Capture ideas and pin important reminders
          </p>
        </div>
        <Link
          to="/notes"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          All notes
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Inline Quick Capture */}
      <form
        onSubmit={handleQuickAdd}
        className="border-b border-slate-100 px-4 py-3 dark:border-slate-800"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            placeholder="Jot down a quick note..."
            aria-label="Quick note input"
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!quickText.trim()}
            aria-label="Add quick note"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Save
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="p-4">
        {sortedNotes.length === 0 ? (
          <EmptyState
            icon={StickyNote}
            compact
            title="No notes yet"
            description="Write a quick note above to keep key thoughts close at hand."
          />
        ) : (
          <div className="space-y-2.5">
            {sortedNotes.slice(0, 4).map((note) => (
              <article
                key={note.id}
                className={`group rounded-lg border p-3.5 transition-colors ${
                  note.pinned
                    ? 'border-indigo-200/80 bg-indigo-50/30 dark:border-indigo-900/60 dark:bg-indigo-950/20'
                    : 'border-slate-200/80 bg-slate-50/40 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {note.title}
                  </h3>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => togglePinNote(note.id)}
                      aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                      title={note.pinned ? 'Unpin note' : 'Pin note'}
                      className={`rounded-md p-1 transition-colors ${
                        note.pinned
                          ? 'text-indigo-600 hover:bg-indigo-100/70 dark:text-indigo-400 dark:hover:bg-indigo-950/80'
                          : 'text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <Pin className={`h-3.5 w-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNote(note);
                        setModalOpen(true);
                      }}
                      aria-label={`Edit "${note.title}"`}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      aria-label={`Delete "${note.title}"`}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {note.content}
                </p>
                <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                  Updated {formatRelativeTime(note.updatedAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      <NoteFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialNote={editingNote}
        onSubmit={(data) => {
          if (editingNote) {
            updateNote(editingNote.id, data);
          } else {
            addNote(data);
          }
        }}
      />
    </section>
  );
}

