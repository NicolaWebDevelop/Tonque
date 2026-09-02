export function initNewsNavigation({
  newsNavigation,
  newsSection,
  pageSize,
  getCurrentIndex
}) {
  if (!newsNavigation) {
    return {
      update: () => {},
      setActivePage: () => {}
    };
  }

  let activePage = 1;

const bookmarkSection =
  document.getElementById("segnalibri");

  const homeSection =
  document.getElementById("home");


  /* =========================
     SCROLL PAGINA
  ========================== */

  function scrollToNewsPage(page) {
    const totalPages =
      Math.ceil(getCurrentIndex() / pageSize);

    if (totalPages === 0) return;

    const targetPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    const target =
      document.getElementById(
        `news-page-${targetPage}`
      );

    if (!target) return;

    activePage = targetPage;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    update();
  }


  /* =========================
     PAGINE DA MOSTRARE
  ========================== */

  function getNavigationPages(
    totalPages,
    currentPage
  ) {
    const pages = new Set([
      1,
      totalPages,
      currentPage - 1,
      currentPage,
      currentPage + 1
    ]);

    return [...pages]
      .filter(
        page =>
          page >= 1 &&
          page <= totalPages
      )
      .sort((a, b) => a - b);
  }


  /* =========================
     UPDATE NAVIGATION
  ========================== */

  function update() {
    newsNavigation.replaceChildren();

    const totalPages =
      Math.ceil(getCurrentIndex() / pageSize);

    if (totalPages === 0) {
      newsNavigation.hidden = true;
      return;
    }

    newsNavigation.hidden = false;


    /* FRECCIA PRECEDENTE */

    const previousButton =
      document.createElement("button");

    previousButton.type = "button";
    previousButton.className =
      "news-nav-arrow";

    previousButton.textContent = "‹";

    previousButton.setAttribute(
      "aria-label",
      "Blocco precedente"
    );

    previousButton.disabled =
      activePage === 1;

    previousButton.addEventListener(
      "click",
      () => {
        scrollToNewsPage(
          activePage - 1
        );
      }
    );

    newsNavigation.appendChild(
      previousButton
    );


    /* NUMERI */

    const pages =
      getNavigationPages(
        totalPages,
        activePage
      );

    let previousPage = null;

    pages.forEach(page => {

      if (
        previousPage !== null &&
        page - previousPage > 1
      ) {
        const ellipsis =
          document.createElement("span");

        ellipsis.className =
          "news-nav-ellipsis";

        ellipsis.textContent = "…";

        newsNavigation.appendChild(
          ellipsis
        );
      }

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "news-page-button";

      button.textContent = page;

      button.setAttribute(
        "aria-label",
        `Vai al blocco ${page}`
      );

      if (page === activePage) {
        button.classList.add("active");

        button.setAttribute(
          "aria-current",
          "page"
        );
      }

      button.addEventListener(
        "click",
        () => {
          scrollToNewsPage(page);
        }
      );

      newsNavigation.appendChild(
        button
      );

      previousPage = page;
    });


    /* FRECCIA SUCCESSIVA */

    const nextButton =
      document.createElement("button");

    nextButton.type = "button";

    nextButton.className =
      "news-nav-arrow";

    nextButton.textContent = "›";

    nextButton.setAttribute(
      "aria-label",
      "Blocco successivo"
    );

    nextButton.disabled =
      activePage === totalPages;

    nextButton.addEventListener(
      "click",
      () => {
        scrollToNewsPage(
          activePage + 1
        );
      }
    );

    newsNavigation.appendChild(
      nextButton
    );
  }


 /* =========================
   VISIBILITÀ NAVIGATORE
========================== */

let newsVisible = false;
let bookmarksVisible = false;
let homeVisible = true;

function updateNavigationVisibility() {
  newsNavigation.classList.toggle(
    "is-visible",
    newsVisible &&
    !bookmarksVisible &&
    !homeVisible
  );
}


/* OSSERVA HOME */

if (
  homeSection &&
  "IntersectionObserver" in window
) {
  const homeObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          homeVisible =
            entry.isIntersecting;

          updateNavigationVisibility();
        });
      },
      {
        threshold: 0.01
      }
    );

  homeObserver.observe(
    homeSection
  );
}


/* OSSERVA SEZIONE NOTIZIE */

if (
  newsSection &&
  "IntersectionObserver" in window
) {
  const newsObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          newsVisible =
            entry.isIntersecting;

          updateNavigationVisibility();
        });
      },
      {
        threshold: 0,
        rootMargin: "-1px 0px -1px 0px"
      }
    );

  newsObserver.observe(
    newsSection
  );
}


/* OSSERVA SEZIONE SEGNALIBRI */

if (
  bookmarkSection &&
  "IntersectionObserver" in window
) {
  const bookmarkObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          bookmarksVisible =
            entry.isIntersecting;

          updateNavigationVisibility();
        });
      },
      {
        threshold: 0.01
      }
    );

  bookmarkObserver.observe(
    bookmarkSection
  );
}

  /* =========================
     SET PAGINA ATTIVA
  ========================== */

  function setActivePage(page) {
    activePage = page;
    update();
  }


  return {
    update,
    setActivePage
  };
}