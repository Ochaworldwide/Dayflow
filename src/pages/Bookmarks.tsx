import { useMemo, useState } from 'react';
import {
  Bookmark as BookmarkIcon,
  ExternalLink,
  Globe,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Bookmark, BookmarkCategory } from '../types';
import { BOOKMARK_CATEGORIES } from '../utils/sampleData';
import { extractDomain } from '../utils/dateUtils';
import { CategoryBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { BookmarkFormModal } from '../components/bookmarks/BookmarkFormModal';

type CategoryFilter = 'All' | BookmarkCategory;

export function Bookmarks() {
  const { bookmarks, addBookmark, updateBookmark, deleteBookmark } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const filteredBookmarks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookmarks.filter((bm) => {
      if (selectedCategory !== 'All' && bm.category !== selectedCategory) {
        return false;
      }
      if (
        q &&
        !bm.title.toLowerCase().includes(q) &&
        !bm.url.toLowerCase().includes(q) &&
        !(bm.description ?? '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setEditingBookmark(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (bm: Bookmark) => {
    setEditingBookmark(bm);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bookmarks
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Save and organize your favorite documentation, tools, and articles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Bookmark
        </button>
      </div>

      {/* Category Filter & Search */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Filter bookmarks by category"
        >
          {(['All', ...BOOKMARK_CATEGORIES] as CategoryFilter[]).map((cat) => {
            const active = selectedCategory === cat;
            const count =
              cat === 'All'
                ? bookmarks.length
                : bookmarks.filter((b) => b.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
                <span
                  className={`text-[11px] ${
                    active
                      ? 'text-white/75'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            aria-label="Search bookmarks"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear bookmark search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <EmptyState
          icon={BookmarkIcon}
          title={
            selectedCategory !== 'All' || searchQuery
              ? 'No matching bookmarks'
              : 'No bookmarks saved yet'
          }
          description={
            selectedCategory !== 'All' || searchQuery
              ? 'Try selecting a different category or clearing your search.'
              : 'Add your first link so your essential tools are always one click away.'
          }
          action={
            selectedCategory !== 'All' || searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Reset filters
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Bookmark
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredBookmarks.map((bm) => (
            <article
              key={bm.id}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                      >
                        <span className="truncate">{bm.title}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      </a>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {extractDomain(bm.url)}
                      </p>
                    </div>
                  </div>
                </div>

                {bm.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {bm.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <CategoryBadge category={bm.category} />
                <div className="flex items-center gap-1">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(bm)}
                    aria-label={`Edit "${bm.title}"`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBookmark(bm.id)}
                    aria-label={`Delete "${bm.title}"`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

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
    </div>
  );
}

