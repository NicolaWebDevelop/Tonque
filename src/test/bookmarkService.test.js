import { describe, expect, it } from "vitest";

import {
  isBookmarked,
  toggleBookmark
} from "../js/services/bookmarkService.js";

describe("bookmarkService", () => {
  const news = {
    id: 123,
    title: "News di prova"
  };

  it("riconosce una news salvata", () => {
    const bookmarks = [news];

    expect(
      isBookmarked(bookmarks, 123)
    ).toBe(true);
  });

  it("riconosce una news non salvata", () => {
    const bookmarks = [];

    expect(
      isBookmarked(bookmarks, 123)
    ).toBe(false);
  });

  it("aggiunge una news ai segnalibri", () => {
    const bookmarks = [];

    const result = toggleBookmark(
      bookmarks,
      news
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(news);
  });

  it("rimuove una news già salvata", () => {
    const bookmarks = [news];

    const result = toggleBookmark(
      bookmarks,
      news
    );

    expect(result).toHaveLength(0);
  });
});