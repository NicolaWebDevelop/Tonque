import { formatDate } from "./utils/formatDate.js";

import {
  isBookmarked,
  toggleBookmark as toggleBookmarkData
} from "./services/bookmarkService.js";

import {
  getLatestIds,
  getNewsById
} from "./services/hackerNewsService.js";

import {
  initNewsNavigation
} from "./navigatore.js";

import {
  getArticleImage
} from "./services/articleImageService.js";


/* =========================================================
   IMMAGINE FALLBACK TONGUE
========================================================= */

const NEWS_FALLBACK_IMAGE =
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="400"
      viewBox="0 0 600 400"
    >
      <rect
        width="600"
        height="400"
        fill="#0b0f1a"
      />

      <text
        x="50%"
        y="47%"
        text-anchor="middle"
        fill="#ffffff"
        font-family="Arial, sans-serif"
        font-size="42"
        font-weight="700"
      >
        TONGUE
      </text>

      <text
        x="50%"
        y="57%"
        text-anchor="middle"
        fill="#a82b2c"
        font-family="Arial, sans-serif"
        font-size="20"
        font-weight="600"
      >
        NEWS
      </text>
    </svg>
  `)}`;


/* =========================================================
   CARICA IMMAGINE PERTINENTE
========================================================= */

async function setRelevantNewsImage(
  imageElement,
  news
) {

  if (!imageElement) {
    return;
  }


  /* =======================================================
     FALLBACK IMMEDIATO
  ======================================================== */

  imageElement.src =
    NEWS_FALLBACK_IMAGE;

  imageElement.loading =
    "lazy";

  imageElement.decoding =
    "async";

  imageElement.alt =
    news?.title
      ? `Immagine relativa a ${news.title}`
      : "Immagine notizia";


  try {

    /* =====================================================
       CERCA IMMAGINE
    ====================================================== */

    const result =
      await getArticleImage({
        id: news?.id,
        url: news?.url,
        title: news?.title
      });


    if (!result?.imageUrl) {
      return;
    }


    /* =====================================================
       ERRORE IMMAGINE REMOTA
    ====================================================== */

    imageElement.onerror =
      () => {

        imageElement.onerror =
          null;

        imageElement.src =
          NEWS_FALLBACK_IMAGE;
      };


    /* =====================================================
       SALVA FONTE IMMAGINE
    ====================================================== */

    imageElement.dataset.imageSource =
      result.source;


    /* =====================================================
       MOSTRA IMMAGINE
    ====================================================== */

    imageElement.src =
      result.imageUrl;

  } catch (error) {

    console.warn(
      "Errore caricamento immagine news:",
      error
    );
  }
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =====================================================
       ELEMENTI DOM
    ====================================================== */

    const newsList =
      document.querySelector(
        ".news-list"
      );

    const bookmarkList =
      document.querySelector(
        ".bookmark-list"
      );

    const loadMoreButton =
      document.getElementById(
        "load-more"
      );

    const counter =
      document.getElementById(
        "news-counter"
      );

    const newsNavigation =
      document.getElementById(
        "news-navigation"
      );

    const newsSection =
      document.getElementById(
        "notizie"
      );


    /* =====================================================
       BOOKMARK DOM
    ====================================================== */

    const bookmarkLoadMoreButton =
      document.getElementById(
        "bookmark-load-more"
      );

    const bookmarkCounter =
      document.getElementById(
        "bookmark-counter"
      );

    const bookmarkMoreContainer =
      document.getElementById(
        "bookmark-more-container"
      );

    const bookmarkClearButton =
      document.getElementById(
        "bookmark-clear-all"
      );

    const bookmarkClearModal =
      document.getElementById(
        "bookmark-clear-modal"
      );

    const bookmarkClearCancel =
      document.getElementById(
        "bookmark-clear-cancel"
      );

    const bookmarkClearConfirm =
      document.getElementById(
        "bookmark-clear-confirm"
      );

    const bookmarkClearOverlay =
      document.querySelector(
        ".bookmark-clear-overlay"
      );


    /* =====================================================
       CONTROLLO ELEMENTI PRINCIPALI
    ====================================================== */

    if (
      !newsList ||
      !loadMoreButton
    ) {
      return;
    }


    /* =====================================================
       STATE
    ====================================================== */

    let newsIds =
      [];

    let currentIndex =
      0;

    const PAGE_SIZE =
      10;

    const BOOKMARK_PAGE_SIZE =
      10;

    let visibleBookmarks =
      BOOKMARK_PAGE_SIZE;

    let isLoading =
      false;

    let bookmarks =
      JSON.parse(
        localStorage.getItem(
          "bookmarks"
        )
      ) || [];


    /* =====================================================
       NEWS NAVIGATOR
    ====================================================== */

    const newsNavigator =
      initNewsNavigation({
        newsNavigation,
        newsSection,
        pageSize:
          PAGE_SIZE,
        getCurrentIndex:
          () => currentIndex
      });


    /* =====================================================
       APRI MODALE CANCELLA SEGNALIBRI
    ====================================================== */

    function openBookmarkClearModal() {

      if (
        !bookmarkClearModal ||
        bookmarks.length === 0
      ) {
        return;
      }


      bookmarkClearModal.hidden =
        false;


      document.body.style.overflow =
        "hidden";


      bookmarkClearCancel?.focus();
    }


    /* =====================================================
       CHIUDI MODALE
    ====================================================== */

    function closeBookmarkClearModal() {

      if (!bookmarkClearModal) {
        return;
      }


      bookmarkClearModal.hidden =
        true;


      document.body.style.overflow =
        "";


      bookmarkClearButton?.focus();
    }


    /* =====================================================
       CANCELLA TUTTI I SEGNALIBRI
    ====================================================== */

    function clearAllBookmarks() {

      bookmarks =
        [];


      visibleBookmarks =
        BOOKMARK_PAGE_SIZE;


      localStorage.removeItem(
        "bookmarks"
      );


      if (bookmarkClearModal) {

        bookmarkClearModal.hidden =
          true;
      }


      document.body.style.overflow =
        "";


      renderBookmarks();

      updateBookmarkIcons();
    }


    /* =====================================================
       CONTATORE NEWS
    ====================================================== */

    function updateCounter() {

      if (!counter) {
        return;
      }


      const shown =
        Math.min(
          currentIndex,
          newsIds.length
        );


      counter.textContent =
        `Mostrate ${shown} di ${newsIds.length} news`;
    }


    /* =====================================================
       CONTROLLI SEGNALIBRI
    ====================================================== */

    function updateBookmarkControls() {

      if (
        !bookmarkLoadMoreButton ||
        !bookmarkCounter ||
        !bookmarkMoreContainer
      ) {
        return;
      }


      /* ===================================================
         NESSUN SEGNALIBRO
      ==================================================== */

      if (
        bookmarks.length === 0
      ) {

        bookmarkMoreContainer.hidden =
          true;

        bookmarkLoadMoreButton.hidden =
          true;

        bookmarkCounter.hidden =
          true;

        visibleBookmarks =
          BOOKMARK_PAGE_SIZE;

        return;
      }


      /* ===================================================
         SEGNALIBRI PRESENTI
      ==================================================== */

      bookmarkMoreContainer.hidden =
        false;


      const shown =
        Math.min(
          visibleBookmarks,
          bookmarks.length
        );


      bookmarkCounter.hidden =
        false;


      bookmarkCounter.textContent =
        `Mostrati ${shown} di ${bookmarks.length} segnalibri`;


      /* ===================================================
         MOSTRA ALTRI
      ==================================================== */

      if (
        shown <
        bookmarks.length
      ) {

        bookmarkLoadMoreButton.hidden =
          false;


        bookmarkLoadMoreButton.textContent =
          "Mostra altri segnalibri";

      } else {

        bookmarkLoadMoreButton.hidden =
          true;
      }
    }


    /* =====================================================
       TOGGLE BOOKMARK
    ====================================================== */

    function toggleBookmark(
      news
    ) {

      bookmarks =
        toggleBookmarkData(
          bookmarks,
          news
        );


      localStorage.setItem(
        "bookmarks",
        JSON.stringify(
          bookmarks
        )
      );


      renderBookmarks();

      updateBookmarkIcons();
    }


    /* =====================================================
       AGGIORNA ICONE BOOKMARK
    ====================================================== */

    function updateBookmarkIcons() {

      document
        .querySelectorAll(
          ".bookmark-btn"
        )
        .forEach(
          button => {

            const id =
              Number(
                button.dataset.id
              );


            button.classList.toggle(
              "saved",
              isBookmarked(
                bookmarks,
                id
              )
            );
          }
        );
    }


    /* =====================================================
       CREA PULSANTE BOOKMARK
    ====================================================== */

    function createBookmarkButton(
      news
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "bookmark-btn";


      button.dataset.id =
        news.id;


      button.setAttribute(
        "aria-label",
        "Salva nei segnalibri"
      );


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
        isBookmarked(
          bookmarks,
          news.id
        )
      );


      button.addEventListener(
        "click",
        () => {

          toggleBookmark(
            news
          );
        }
      );


      return button;
    }


    /* =====================================================
       RENDER NEWS
    ====================================================== */

    function renderNews(
      news
    ) {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "news-card";


      /* ===================================================
         IMAGE
      ==================================================== */

      const img =
        document.createElement(
          "img"
        );


      setRelevantNewsImage(
        img,
        news
      );


      /* ===================================================
         BODY
      ==================================================== */

      const body =
        document.createElement(
          "div"
        );


      body.className =
        "news-body";


      /* ===================================================
         TITLE
      ==================================================== */

      const title =
        document.createElement(
          "h3"
        );


      title.textContent =
        news.title;


      /* ===================================================
         DATE
      ==================================================== */

      const date =
        document.createElement(
          "p"
        );


      date.className =
        "news-date";


      date.textContent =
        "🕒 " +
        formatDate(
          news.time
        );


      /* ===================================================
         LINK
      ==================================================== */

      const link =
        document.createElement(
          "a"
        );


      link.href =
        news.url ||
        `https://news.ycombinator.com/item?id=${news.id}`;


      link.target =
        "_blank";


      link.rel =
        "noopener noreferrer";


      link.className =
        "btn-glass";


      link.textContent =
        "Leggi news";


      /* ===================================================
         BOOKMARK
      ==================================================== */

      const bookmarkBtn =
        createBookmarkButton(
          news
        );


      /* ===================================================
         ACTIONS
      ==================================================== */

      const actions =
        document.createElement(
          "div"
        );


      actions.className =
        "news-actions";


      actions.appendChild(
        link
      );


      actions.appendChild(
        bookmarkBtn
      );


      /* ===================================================
         BUILD CARD
      ==================================================== */

      body.appendChild(
        title
      );


      body.appendChild(
        date
      );


      body.appendChild(
        actions
      );


      card.appendChild(
        img
      );


      card.appendChild(
        body
      );


      newsList.appendChild(
        card
      );


      return card;
    }


    /* =====================================================
       RENDER BOOKMARKS
    ====================================================== */

    function renderBookmarks() {

      if (!bookmarkList) {
        return;
      }


      bookmarkList.replaceChildren();


      /* ===================================================
         NESSUN SEGNALIBRO
      ==================================================== */

      if (
        bookmarks.length === 0
      ) {

        const emptyCard =
          document.createElement(
            "article"
          );


        emptyCard.className =
          "news-card empty-bookmark";


        const body =
          document.createElement(
            "div"
          );


        body.className =
          "news-body empty-body";


        const icon =
          document.createElement(
            "div"
          );


        icon.className =
          "empty-icon";


        icon.textContent =
          "🔖";


        const text =
          document.createElement(
            "p"
          );


        text.textContent =
          "Non hai ancora salvato nessuna news.";


        body.appendChild(
          icon
        );


        body.appendChild(
          text
        );


        emptyCard.appendChild(
          body
        );


        bookmarkList.appendChild(
          emptyCard
        );


        updateBookmarkControls();

        return;
      }


      /* ===================================================
         SEGNALIBRI VISIBILI
      ==================================================== */

      const visibleItems =
        bookmarks.slice(
          0,
          visibleBookmarks
        );


      visibleItems.forEach(
        news => {

          const card =
            document.createElement(
              "article"
            );


          card.className =
            "news-card bookmark-card";


          /* ===============================================
             IMAGE
          ================================================ */

          const img =
            document.createElement(
              "img"
            );


          setRelevantNewsImage(
            img,
            news
          );


          /* ===============================================
             BODY
          ================================================ */

          const body =
            document.createElement(
              "div"
            );


          body.className =
            "news-body";


          /* ===============================================
             TITLE
          ================================================ */

          const title =
            document.createElement(
              "h3"
            );


          title.textContent =
            news.title;


          /* ===============================================
             DATE
          ================================================ */

          const date =
            document.createElement(
              "p"
            );


          date.className =
            "news-date";


          date.textContent =
            "🕒 " +
            formatDate(
              news.time
            );


          /* ===============================================
             LINK
          ================================================ */

          const link =
            document.createElement(
              "a"
            );


          link.href =
            news.url ||
            `https://news.ycombinator.com/item?id=${news.id}`;


          link.target =
            "_blank";


          link.rel =
            "noopener noreferrer";


          link.className =
            "btn-glass";


          link.textContent =
            "Leggi news";


          /* ===============================================
             REMOVE BOOKMARK
          ================================================ */

          const removeBtn =
            document.createElement(
              "button"
            );


          removeBtn.type =
            "button";


          removeBtn.className =
            "bookmark-remove";


          removeBtn.textContent =
            "✕";


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
                    bookmark.id !==
                    news.id
                );


              localStorage.setItem(
                "bookmarks",
                JSON.stringify(
                  bookmarks
                )
              );


              renderBookmarks();

              updateBookmarkIcons();
            }
          );


          /* ===============================================
             BUILD CARD
          ================================================ */

          card.appendChild(
            removeBtn
          );


          body.appendChild(
            title
          );


          body.appendChild(
            date
          );


          body.appendChild(
            link
          );


          card.appendChild(
            img
          );


          card.appendChild(
            body
          );


          bookmarkList.appendChild(
            card
          );
        }
      );


      updateBookmarkControls();
    }


    /* =====================================================
       LOAD MORE NEWS
    ====================================================== */

    async function loadMoreNews(
      shouldScroll = false
    ) {

      if (isLoading) {
        return;
      }


      isLoading =
        true;


      loadMoreButton.textContent =
        "Caricamento…";


      loadMoreButton.disabled =
        true;


      /* ===================================================
         PROSSIMI 10 ID
      ==================================================== */

      const nextIds =
        newsIds.slice(
          currentIndex,
          currentIndex +
          PAGE_SIZE
        );


      /* ===================================================
         NUMERO BLOCCO
      ==================================================== */

      const pageNumber =
        Math.floor(
          currentIndex /
          PAGE_SIZE
        ) + 1;


      try {

        const newsArray =
          await Promise.all(

            nextIds.map(
              id =>
                getNewsById(
                  id
                ).catch(
                  () => null
                )
            )
          );


        let firstNewCard =
          null;


        /* =================================================
           CREA CARD
        ================================================== */

        newsArray.forEach(
          news => {

            if (
              news &&
              news.title &&
              news.time
            ) {

              const card =
                renderNews(
                  news
                );


              if (
                !firstNewCard
              ) {

                firstNewCard =
                  card;
              }
            }
          }
        );


        /* =================================================
           ANCORA DEL BLOCCO
        ================================================== */

        if (
          firstNewCard
        ) {

          firstNewCard.id =
            `news-page-${pageNumber}`;


          firstNewCard.classList.add(
            "news-page-start"
          );
        }


        /* =================================================
           AGGIORNA INDICE
        ================================================== */

        currentIndex +=
          nextIds.length;


        /* =================================================
           AGGIORNA UI
        ================================================== */

        updateCounter();

        updateBookmarkIcons();


        newsNavigator.setActivePage(
          pageNumber
        );


        /* =================================================
           SCROLL ALLE NUOVE 10 CARD
        ================================================== */

        if (
          shouldScroll &&
          firstNewCard
        ) {

          firstNewCard.scrollIntoView({
            behavior:
              "smooth",
            block:
              "start"
          });
        }


        /* =================================================
           FINE NEWS
        ================================================== */

        if (
          currentIndex >=
          newsIds.length
        ) {

          loadMoreButton.textContent =
            "Nessun’altra news";


          loadMoreButton.disabled =
            true;

        } else {

          loadMoreButton.textContent =
            "Carica altre news";


          loadMoreButton.disabled =
            false;
        }

      } catch (error) {

        console.error(
          "Errore caricamento news:",
          error
        );


        loadMoreButton.textContent =
          "Riprova";


        loadMoreButton.disabled =
          false;

      } finally {

        isLoading =
          false;
      }
    }


    /* =====================================================
       INIT
    ====================================================== */

    async function init() {

      try {

        newsIds =
          await getLatestIds();


        await loadMoreNews();


        renderBookmarks();

      } catch (error) {

        console.error(
          "Errore caricamento Hacker News:",
          error
        );
      }
    }


    /* =====================================================
       CARICA ALTRE NEWS
    ====================================================== */

    loadMoreButton.addEventListener(
      "click",
      event => {

        event.preventDefault();


        loadMoreNews(
          true
        );
      }
    );


    /* =====================================================
       MOSTRA ALTRI BOOKMARK
    ====================================================== */

    if (
      bookmarkLoadMoreButton
    ) {

      bookmarkLoadMoreButton.addEventListener(
        "click",
        () => {

          visibleBookmarks +=
            BOOKMARK_PAGE_SIZE;


          renderBookmarks();
        }
      );
    }


    /* =====================================================
       CLEAR BOOKMARK EVENTS
    ====================================================== */

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


    /* =====================================================
       ESC CHIUDE LA MODALE
    ====================================================== */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
            "Escape" &&
          bookmarkClearModal &&
          !bookmarkClearModal.hidden
        ) {

          closeBookmarkClearModal();
        }
      }
    );


    /* =====================================================
       START
    ====================================================== */

    init();
  }
);