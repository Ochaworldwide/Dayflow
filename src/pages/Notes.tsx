import { useMemo, useState } from 'react';
import {
  Pencil,
  Pin,
  Plus,
  Search,
  StickyNote,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Note } from '../types';
import { formatRelativeTime } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import { NoteFormModal } from '../components/notes/NoteFormModal';

export function Notes() {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...notes]
      .filter((note) => {
        if (!q) return true;
        return (
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, searchQuery]);

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const renderNoteCard = (note: Note) => (
    <article
      key={note.id}
      className={`group flex flex-col justify-between rounded-xl border p-5 shadow-2xs transition-all duration-150 hover:shadow-sm ${
        note.pinned
          ? 'border-indigo-200/90 bg-indigo-50/25 dark:border-indigo-900/60 dark:bg-indigo-950/20'
          : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {note.title}
          </h2>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => togglePinNote(note.id)}
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
              title={note.pinned ? 'Unpin note' : 'Pin note'}
              className={`rounded-lg p-1.5 transition-colors ${
                note.pinned
                  ? 'text-indigo-600 hover:bg-indigo-100/70 dark:text-indigo-400 dark:hover:bg-indigo-950/80'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Pin className={`h-3.5 w-3.5 ${note.pinned ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(note)}
              aria-label={`Edit "${note.title}"`}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteNote(note.id)}
              aria-label={`Delete "${note.title}"`}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {note.content}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
        <span>Updated {formatRelativeTime(note.updatedAt)}</span>
        {note.pinned && (
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            Pinned
          </span>
        )}
      </div>
    </article>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notes
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Write quick thoughts, meeting summaries, and pin key references.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or content..."
            aria-label="Search notes"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear note search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <span className="hidden text-xs text-slate-400 sm:inline">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={searchQuery ? 'No matching notes' : 'No notes yet'}
          description={
            searchQuery
              ? 'Try searching with different keywords.'
              : 'Create your first note to capture ideas and important details.'
          }
          action={
            searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                New Note
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          {pinnedNotes.length > 0 && (
            <section aria-label="Pinned notes">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Pinned
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </section>
          )}

          {otherNotes.length > 0 && (
            <section aria-label="Other notes">
              {pinnedNotes.length > 0 && (
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  All Notes
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {otherNotes.map(renderNoteCard)}
              </div>
            </section>
          )}
        </div>
      )}

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
    </div>
  );
}

