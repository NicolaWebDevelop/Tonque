import { formatDate } from "../js/utils/formatDate.js";
import {
  isBookmarked,
  toggleBookmark as toggleBookmarkData /* uso l'alias perché in notizie.js ho già la funzione chiamata toggleBookmark(). */
} from "./services/bookmarkService.js";
import {
  getLatestIds,
  getNewsById
} from "./services/hackerNewsService.js";

document.addEventListener("DOMContentLoaded", () => {
  const newsList = document.querySelector(".news-list");
  const bookmarkList = document.querySelector(".bookmark-list");

  const loadMoreButton = document.getElementById("load-more");
  const counter = document.getElementById("news-counter");

  const bookmarkLoadMoreButton =
    document.getElementById("bookmark-load-more");

  const bookmarkCounter =
    document.getElementById("bookmark-counter");

    const bookmarkMoreContainer =
  document.getElementById("bookmark-more-container");

  if (!newsList || !loadMoreButton) return;

  let newsIds = [];
  let currentIndex = 0;

  const PAGE_SIZE = 10;
  const BOOKMARK_PAGE_SIZE = 10;

  let visibleBookmarks = BOOKMARK_PAGE_SIZE;
  let isLoading = false;

  let bookmarks =
    JSON.parse(localStorage.getItem("bookmarks")) || [];

    const bookmarkClearButton =
  document.getElementById("bookmark-clear-all");

const bookmarkClearModal =
  document.getElementById("bookmark-clear-modal");

const bookmarkClearCancel =
  document.getElementById("bookmark-clear-cancel");

const bookmarkClearConfirm =
  document.getElementById("bookmark-clear-confirm");

const bookmarkClearOverlay =
  document.querySelector(".bookmark-clear-overlay");

  /* =========================
   CLEAR ALL BOOKMARKS MODAL
========================= */

function openBookmarkClearModal() {
  if (!bookmarkClearModal || bookmarks.length === 0) return;

  bookmarkClearModal.hidden = false;

  // Blocca lo scroll della pagina
  document.body.style.overflow = "hidden";

  // Porta il focus su Annulla
  bookmarkClearCancel?.focus();
}

function closeBookmarkClearModal() {
  if (!bookmarkClearModal) return;

  bookmarkClearModal.hidden = true;

  // Riattiva lo scroll
  document.body.style.overflow = "";

  bookmarkClearButton?.focus();
}

function clearAllBookmarks() {
  bookmarks = [];

  visibleBookmarks = BOOKMARK_PAGE_SIZE;

  localStorage.removeItem("bookmarks");

  // Chiude la modale
  bookmarkClearModal.hidden = true;
  document.body.style.overflow = "";

  // Aggiorna tutta la UI
  renderBookmarks();
  updateBookmarkIcons();
}

  /* =========================
     NEWS COUNTER
  ========================== */

  function updateCounter() {
    if (!counter) return;

    const shown = Math.min(
      currentIndex,
      newsIds.length
    );

    counter.textContent =
      `Mostrate ${shown} di ${newsIds.length} news`;
  }

  /* =========================
     BOOKMARK CONTROLS
  ========================== */

 function updateBookmarkControls() {
  if (
    !bookmarkLoadMoreButton ||
    !bookmarkCounter ||
    !bookmarkMoreContainer
  ) return;

  /* NESSUN SEGNALIBRO */
  if (bookmarks.length === 0) {
    bookmarkMoreContainer.hidden = true;
    bookmarkLoadMoreButton.hidden = true;
    bookmarkCounter.hidden = true;

    visibleBookmarks = BOOKMARK_PAGE_SIZE;

    return;
  }

  /* CI SONO SEGNALIBRI */
  bookmarkMoreContainer.hidden = false;

  const shown = Math.min(
    visibleBookmarks,
    bookmarks.length
  );

  bookmarkCounter.hidden = false;

  bookmarkCounter.textContent =
    `Mostrati ${shown} di ${bookmarks.length} segnalibri`;

  /* MOSTRA IL PULSANTE SOLO SE CI SONO ALTRI BOOKMARK */
  if (shown < bookmarks.length) {
    bookmarkLoadMoreButton.hidden = false;
    bookmarkLoadMoreButton.textContent =
      "Mostra altri segnalibri";
  } else {
    bookmarkLoadMoreButton.hidden = true;
  }
}

  /* =========================
     BOOKMARK TOGGLE
  ========================== */

  function toggleBookmark(news) {
  bookmarks = toggleBookmarkData(
    bookmarks,
    news
  );

  localStorage.setItem(
    "bookmarks",
    JSON.stringify(bookmarks)
  );

  renderBookmarks();
  updateBookmarkIcons();
}
  /* UPDATE BOOKMARK ICONS  */

 function updateBookmarkIcons() {
  document
    .querySelectorAll(".bookmark-btn")
    .forEach(button => {
      const id = Number(button.dataset.id);

      button.classList.toggle(
        "saved",
        isBookmarked(bookmarks, id)
      );
    });
}

  /* CREATE BOOKMARK BUTTON */

  /* CREATE BOOKMARK BUTTON */

function createBookmarkButton(news) {
  const button = document.createElement("button");

  button.className = "bookmark-btn";
  button.dataset.id = news.id;
  button.setAttribute("aria-label", "Salva nei segnalibri");

  button.innerHTML = `
    <svg
      viewBox="0 0 24 24"
      class="bookmark-icon"
      aria-hidden="true"
    >
      <path
        class="bookmark-outline"
        d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />

      <path
        class="bookmark-filled"
        d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z"
      />
    </svg>
  `;

  button.classList.toggle(
    "saved",
    isBookmarked(bookmarks, news.id)
  );

  button.addEventListener("click", () => {
    toggleBookmark(news);
  });

  return button;
}

  /* =========================
     RENDER NEWS CARD
  ========================== */

  function renderNews(news) {
    const card =
      document.createElement("article");

    card.className = "news-card";

    const img =
      document.createElement("img");

    img.src =
      `https://picsum.photos/seed/${news.id}/600/400`;

    img.alt = news.title;

    const body =
      document.createElement("div");

    body.className = "news-body";

    const title =
      document.createElement("h3");

    title.textContent = news.title;

    const date =
      document.createElement("p");

    date.className = "news-date";

    date.textContent =
      "🕒 " + formatDate(news.time);

    const link =
      document.createElement("a");

    link.href =
      news.url ||
      `https://news.ycombinator.com/item?id=${news.id}`;

    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "btn-glass";
    link.textContent = "Leggi news";

    const bookmarkBtn =
      createBookmarkButton(news);

    const actions =
      document.createElement("div");

    actions.className = "news-actions";

    actions.appendChild(link);
    actions.appendChild(bookmarkBtn);

    body.appendChild(title);
    body.appendChild(date);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);

    newsList.appendChild(card);
  }

  /* =========================
     RENDER BOOKMARKS
  ========================== */

  function renderBookmarks() {
    if (!bookmarkList) return;

    bookmarkList.replaceChildren();

    /* NESSUN SEGNALIBRO */

    if (bookmarks.length === 0) {
      const emptyCard =
        document.createElement("article");

      emptyCard.className =
        "news-card empty-bookmark";

      const body =
        document.createElement("div");

      body.className =
        "news-body empty-body";

      const icon =
        document.createElement("div");

      icon.className = "empty-icon";
      icon.textContent = "🔖";

      const text =
        document.createElement("p");

      text.textContent =
        "Non hai ancora salvato nessuna news.";

      body.appendChild(icon);
      body.appendChild(text);

      emptyCard.appendChild(body);

      bookmarkList.appendChild(
        emptyCard
      );

      updateBookmarkControls();

      return;
    }

    /* SOLO I SEGNALIBRI VISIBILI */

    const visibleItems =
      bookmarks.slice(
        0,
        visibleBookmarks
      );

    visibleItems.forEach(news => {
      const card =
        document.createElement("article");

      card.className =
        "news-card bookmark-card";

      const img =
        document.createElement("img");

      img.src =
        `https://picsum.photos/seed/${news.id}/600/400`;

      img.alt = news.title;

      const body =
        document.createElement("div");

      body.className = "news-body";

      const title =
        document.createElement("h3");

      title.textContent = news.title;

      const date =
        document.createElement("p");

      date.className = "news-date";

      date.textContent =
        "🕒 " + formatDate(news.time);

      const link =
        document.createElement("a");

      link.href =
        news.url ||
        `https://news.ycombinator.com/item?id=${news.id}`;

      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "btn-glass";
      link.textContent = "Leggi news";

      /* REMOVE BUTTON */

      const removeBtn =
        document.createElement("button");

      removeBtn.className =
        "bookmark-remove";

      removeBtn.textContent = "✕";

      removeBtn.setAttribute(
        "aria-label",
        "Rimuovi dai segnalibri"
      );

      removeBtn.addEventListener(
        "click",
        () => {
          bookmarks =
            bookmarks.filter(
              bookmark =>
                bookmark.id !== news.id
            );

          localStorage.setItem(
            "bookmarks",
            JSON.stringify(bookmarks)
          );

          renderBookmarks();
          updateBookmarkIcons();
        }
      );

      card.appendChild(removeBtn);

      body.appendChild(title);
      body.appendChild(date);
      body.appendChild(link);

      card.appendChild(img);
      card.appendChild(body);

      bookmarkList.appendChild(card);
    });

    updateBookmarkControls();
  }

  /* =========================
     LOAD NEWS
  ========================== */
async function loadMoreNews(shouldScroll = false) {
  if (isLoading) return;

  isLoading = true;

  loadMoreButton.textContent = "Caricamento…";
  loadMoreButton.disabled = true;

  const nextIds = newsIds.slice(
    currentIndex,
    currentIndex + PAGE_SIZE
  );

  try {
    const newsArray = await Promise.all(
      nextIds.map(id =>
        getNewsById(id).catch(() => null)
      )
    );

    newsList.replaceChildren();

newsArray.forEach(news => {
  if (news && news.title && news.time) {
    renderNews(news);
  }
});

if (shouldScroll) {
  newsList.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

currentIndex += PAGE_SIZE;

    updateCounter();
    updateBookmarkIcons();

    if (currentIndex >= newsIds.length) {
      loadMoreButton.textContent = "Nessun’altra news";
      loadMoreButton.disabled = true;
    } else {
      loadMoreButton.textContent = "Carica altre news";
      loadMoreButton.disabled = false;
    }

  } catch (error) {
    console.error(
      "Errore caricamento news:",
      error
    );

    loadMoreButton.textContent = "Riprova";
    loadMoreButton.disabled = false;

  } finally {
    isLoading = false;
  }
}

  /* =========================
     INIT
  ========================== */

  async function init() {
  try {
    newsIds = await getLatestIds();

    loadMoreNews();
    renderBookmarks();
  } catch (error) {
    console.error(
      "Errore caricamento Hacker News:",
      error
    );
  }
}

  /* EVENTS */
/* =========================
   EVENTS
========================= */

loadMoreButton.addEventListener(
  "click",
  event => {
    event.preventDefault();
    loadMoreNews(true);
  }
);

if (bookmarkLoadMoreButton) {
  bookmarkLoadMoreButton.addEventListener(
    "click",
    () => {
      visibleBookmarks += BOOKMARK_PAGE_SIZE;
      renderBookmarks();
    }
  );
}


/* =========================
   CLEAR BOOKMARK EVENTS
========================= */

bookmarkClearButton?.addEventListener(
  "click",
  openBookmarkClearModal
);

bookmarkClearCancel?.addEventListener(
  "click",
  closeBookmarkClearModal
);

bookmarkClearOverlay?.addEventListener(
  "click",
  closeBookmarkClearModal
);

bookmarkClearConfirm?.addEventListener(
  "click",
  clearAllBookmarks
);

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    bookmarkClearModal &&
    !bookmarkClearModal.hidden
  ) {
    closeBookmarkClearModal();
  }
});


/* =========================
   INIT
========================= */

init();

});