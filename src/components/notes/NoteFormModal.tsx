import { useState, type FormEvent } from 'react';
import { Pin } from 'lucide-react';
import type { Note } from '../../types';
import type { NoteInput } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteInput) => void;
  initialNote?: Note | null;
}

function NoteFormBody({
  initialNote,
  onClose,
  onSubmit,
}: {
  initialNote?: Note | null;
  onClose: () => void;
  onSubmit: (data: NoteInput) => void;
}) {
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [pinned, setPinned] = useState(initialNote?.pinned ?? false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('Please enter a title or note content.');
      return;
    }
    onSubmit({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      pinned,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="note-title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="Note title..."
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Content <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="note-content"
          rows={5}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError('');
          }}
          placeholder="Write your note here..."
          className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {error && (
          <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setPinned((prev) => !prev)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            pinned
              ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <Pin className={`h-3.5 w-3.5 ${pinned ? 'fill-current' : ''}`} />
          {pinned ? 'Pinned to top' : 'Pin note'}
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            {initialNote ? 'Save Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </form>
  );
}

export function NoteFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialNote,
}: NoteFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? 'Edit Note' : 'New Note'}
      description={
        initialNote
          ? 'Make changes to your saved note.'
          : 'Capture a quick thought, meeting note, or checklist.'
      }
    >
      {isOpen && (
        <NoteFormBody
          key={initialNote?.id ?? 'new-note'}
          initialNote={initialNote}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}
