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


  /* =========================================================
     ELEMENTI DOM
  ========================================================= */

  const floatingControls =
    document.getElementById(
      "news-floating-controls"
    );

  const bookmarkSection =
    document.getElementById(
      "segnalibri"
    );

  const bookmarkShortcut =
    document.getElementById(
      "bookmark-shortcut"
    );

  const homeSection =
    document.getElementById(
      "home"
    );


  /* =========================================================
     STATE
  ========================================================= */

  let activePage = 1;

  let newsVisible = false;
  let bookmarksVisible = false;
  let homeVisible = true;

  let ticking = false;


  /* =========================================================
     TOTALE BLOCCHI CARICATI
  ========================================================= */

  function getTotalPages() {

    return Math.ceil(
      getCurrentIndex() / pageSize
    );

  }


  /* =========================================================
     SCROLL A UN BLOCCO
  ========================================================= */

  function scrollToNewsPage(page) {

    const totalPages =
      getTotalPages();


    if (totalPages === 0) {
      return;
    }


    const targetPage =
      Math.min(
        Math.max(page, 1),
        totalPages
      );


    const target =
      document.getElementById(
        `news-page-${targetPage}`
      );


    if (!target) {
      return;
    }


    activePage =
      targetPage;


    updateActiveState();


    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  /* =========================================================
     AGGIORNA NUMERO ATTIVO
  ========================================================= */

  function updateActiveState() {

    const buttons =
      newsNavigation.querySelectorAll(
        ".news-nav-item"
      );


    buttons.forEach(button => {

      const page =
        Number(
          button.dataset.page
        );


      const isActive =
        page === activePage;


      button.classList.toggle(
        "active",
        isActive
      );


      if (isActive) {

        button.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        button.removeAttribute(
          "aria-current"
        );

      }

    });
  }


  /* =========================================================
     VISIBILITÀ MENU
  ========================================================= */

  function updateNavigationVisibility() {

    if (!floatingControls) {
      return;
    }


    const hasNews =
      getCurrentIndex() > 0;


    const shouldShow =
      hasNews &&
      newsVisible &&
      !bookmarksVisible &&
      !homeVisible;


    floatingControls.classList.toggle(
      "is-visible",
      shouldShow
    );
  }


  /* =========================================================
     CREA MENU VERTICALE
  ========================================================= */

  function update() {

    newsNavigation.replaceChildren();


    const totalPages =
      getTotalPages();


    if (totalPages === 0) {

      newsNavigation.hidden =
        true;

      updateNavigationVisibility();

      return;
    }


    newsNavigation.hidden =
      false;


    /*
      Mostriamo sempre almeno:
      1
      2
      3

      Dal quarto blocco in poi
      il menu cresce automaticamente.
    */

    const visiblePages =
      Math.max(
        3,
        totalPages
      );


    for (
      let page = 1;
      page <= visiblePages;
      page += 1
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "news-nav-item";


      button.dataset.page =
        page;


      const isAvailable =
        page <= totalPages;


      /* =====================================================
         BLOCCO NON ANCORA CARICATO
      ===================================================== */

      if (!isAvailable) {

        button.classList.add(
          "is-placeholder"
        );


        button.disabled =
          true;


        button.setAttribute(
          "aria-label",
          `Blocco ${page} non ancora caricato`
        );

      } else {

        button.setAttribute(
          "aria-label",
          `Vai al blocco ${page}`
        );

      }


      /* =====================================================
         NUMERO
      ===================================================== */

      const number =
        document.createElement(
          "span"
        );


      number.className =
        "news-nav-number";


      number.textContent =
        page;


      number.setAttribute(
        "aria-hidden",
        "true"
      );


      button.appendChild(
        number
      );


      /* =====================================================
         CLICK SOLO SE CARICATO
      ===================================================== */

      if (isAvailable) {

        button.addEventListener(
          "click",
          () => {

            scrollToNewsPage(
              page
            );

          }
        );

      }


      newsNavigation.appendChild(
        button
      );
    }


    updateActiveState();

    updateNavigationVisibility();
  }


  /* =========================================================
     RILEVA BLOCCO DURANTE LO SCROLL
  ========================================================= */

  function detectActivePage() {

    const totalPages =
      getTotalPages();


    if (totalPages === 0) {
      return;
    }


    /*
      Punto di riferimento:
      circa il 40% dello schermo.
    */

    const referencePoint =
      window.innerHeight * 0.4;


    let detectedPage = 1;


    for (
      let page = 1;
      page <= totalPages;
      page += 1
    ) {

      const target =
        document.getElementById(
          `news-page-${page}`
        );


      if (!target) {
        continue;
      }


      const rect =
        target.getBoundingClientRect();


      if (
        rect.top <=
        referencePoint
      ) {

        detectedPage =
          page;

      } else {

        break;

      }

    }


    if (
      detectedPage !==
      activePage
    ) {

      activePage =
        detectedPage;


      updateActiveState();
    }
  }


  /* =========================================================
     PERFORMANCE SCROLL
  ========================================================= */

  function handleScroll() {

    if (ticking) {
      return;
    }


    ticking = true;


    window.requestAnimationFrame(
      () => {

        detectActivePage();

        ticking = false;

      }
    );
  }


  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    detectActivePage
  );


  /* =========================================================
     OSSERVA HOME
  ========================================================= */

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


  /* =========================================================
     OSSERVA NOTIZIE
  ========================================================= */

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

          rootMargin:
            "-1px 0px -1px 0px"
        }
      );


    newsObserver.observe(
      newsSection
    );
  }


  /* =========================================================
     OSSERVA SEGNALIBRI
  ========================================================= */

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


  /* =========================================================
     VAI AI SEGNALIBRI
  ========================================================= */

  bookmarkShortcut?.addEventListener(
    "click",
    event => {

      event.preventDefault();


      bookmarkSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* =========================================================
     SET PAGINA ATTIVA
  ========================================================= */

  function setActivePage(page) {

    const totalPages =
      getTotalPages();


    if (totalPages === 0) {
      return;
    }


    activePage =
      Math.min(
        Math.max(page, 1),
        totalPages
      );


    update();
  }


  /* =========================================================
     INIT
  ========================================================= */

  updateNavigationVisibility();


  return {
    update,
    setActivePage
  };
}