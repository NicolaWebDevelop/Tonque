export function isBookmarked(bookmarks, newsId) {
  return bookmarks.some(bookmark => bookmark.id === newsId);
}

export function toggleBookmark(bookmarks, news) {
  const exists = isBookmarked(bookmarks, news.id);

  if (exists) {
    return bookmarks.filter(bookmark => bookmark.id !== news.id);
  }

  return [...bookmarks, news];
}