import { useState, type FormEvent } from 'react';
import type { Bookmark, BookmarkCategory } from '../../types';
import type { BookmarkInput } from '../../context/AppContext';
import { BOOKMARK_CATEGORIES } from '../../utils/sampleData';
import { isValidUrl } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';

interface BookmarkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookmarkInput) => void;
  initialBookmark?: Bookmark | null;
}

function BookmarkFormBody({
  initialBookmark,
  onClose,
  onSubmit,
}: {
  initialBookmark?: Bookmark | null;
  onClose: () => void;
  onSubmit: (data: BookmarkInput) => void;
}) {
  const [title, setTitle] = useState(initialBookmark?.title ?? '');
  const [url, setUrl] = useState(initialBookmark?.url ?? '');
  const [category, setCategory] = useState<BookmarkCategory>(
    initialBookmark?.category ?? 'Work'
  );
  const [description, setDescription] = useState(
    initialBookmark?.description ?? ''
  );
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      nextErrors.title = 'Please enter a title.';
    }
    if (!url.trim()) {
      nextErrors.url = 'Please enter a website URL.';
    } else if (!isValidUrl(url)) {
      nextErrors.url = 'Please enter a valid URL (e.g., https://example.com).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      url: url.trim(),
      category,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="bm-title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="bm-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="e.g., React Documentation"
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {errors.title && (
          <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bm-url"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Website URL <span className="text-rose-500">*</span>
        </label>
        <input
          id="bm-url"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
          }}
          placeholder="https://react.dev"
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {errors.url && (
          <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {errors.url}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bm-category"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Category
        </label>
        <select
          id="bm-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as BookmarkCategory)}
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {BOOKMARK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="bm-description"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Description{' '}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="bm-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief note about why this link is useful..."
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
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
          {initialBookmark ? 'Save Changes' : 'Save Bookmark'}
        </button>
      </div>
    </form>
  );
}

export function BookmarkFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialBookmark,
}: BookmarkFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
      description={
        initialBookmark
          ? 'Update bookmark title, URL, or category.'
          : 'Save a useful website or resource for quick access.'
      }
    >
      {isOpen && (
        <BookmarkFormBody
          key={initialBookmark?.id ?? 'new-bookmark'}
          initialBookmark={initialBookmark}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}
