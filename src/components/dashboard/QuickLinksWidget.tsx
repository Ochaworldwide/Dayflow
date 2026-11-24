import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark as BookmarkIcon,
  ExternalLink,
  Globe,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Bookmark } from '../../types';
import { extractDomain } from '../../utils/dateUtils';
import { CategoryBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { BookmarkFormModal } from '../bookmarks/BookmarkFormModal';

export function QuickLinksWidget() {
  const { bookmarks, addBookmark, updateBookmark, deleteBookmark } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const handleOpenCreate = () => {
    setEditingBookmark(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setModalOpen(true);
  };

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Quick Links
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Frequently visited websites and tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
          <Link
            to="/bookmarks"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        {bookmarks.length === 0 ? (
          <EmptyState
            icon={BookmarkIcon}
            compact
            title="No bookmarks saved"
            description="Save links to docs, dashboards, and tools you open every day."
            action={
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Bookmark
              </button>
            }
          />
        ) : (
          <ul className="space-y-2">
            {bookmarks.slice(0, 5).map((bm) => (
              <li
                key={bm.id}
                className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 px-3 py-2.5 transition-colors hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/40"
              >
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                        {bm.title}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                    </div>
                    <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                      {extractDomain(bm.url)}
                    </p>
                  </div>
                </a>

                <div className="flex shrink-0 items-center gap-1.5">
                  <CategoryBadge category={bm.category} />
                  <div className="flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(bm)}
                      aria-label={`Edit "${bm.title}"`}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBookmark(bm.id)}
                      aria-label={`Delete "${bm.title}"`}
                      className="rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BookmarkFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialBookmark={editingBookmark}
        onSubmit={(data) => {
          if (editingBookmark) {
            updateBookmark(editingBookmark.id, data);
          } else {
            addBookmark(data);
          }
        }}
      />
    </section>
  );
}

