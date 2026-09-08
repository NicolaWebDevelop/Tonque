/* =========================================================
   ARTICLE IMAGE SERVICE
========================================================= */

const FUNCTION_URL =
  "/.netlify/functions/article-image";


/*
  Cache in memoria.

  Se la stessa news viene richiesta più volte
  durante la stessa sessione, non rifacciamo
  la chiamata alla Function.
*/

const imageCache =
  new Map();


/* =========================================================
   GET ARTICLE IMAGE
========================================================= */

export async function getArticleImage({
  id,
  url,
  title
}) {

  /* =======================================================
     CACHE KEY
  ======================================================== */

  const cacheKey =
    id ||
    url ||
    title;


  if (
    cacheKey &&
    imageCache.has(cacheKey)
  ) {

    return imageCache.get(
      cacheKey
    );
  }


  /* =======================================================
     PARAMETRI
  ======================================================== */

  const params =
    new URLSearchParams();


  if (url) {

    params.set(
      "url",
      url
    );

  }


  if (title) {

    params.set(
      "title",
      title
    );

  }


  /* =======================================================
     REQUEST
  ======================================================== */

  try {

    const response =
      await fetch(
        `${FUNCTION_URL}?${params.toString()}`
      );


    if (!response.ok) {

      throw new Error(
        `Errore immagini: ${response.status}`
      );

    }


    const data =
      await response.json();


    const result = {

      imageUrl:
        data.imageUrl ||
        null,

      source:
        data.source ||
        "fallback",

      photographer:
        data.photographer ||
        null,

      photographerUrl:
        data.photographerUrl ||
        null,

      photoUrl:
        data.photoUrl ||
        null,

      query:
        data.query ||
        null

    };


    /* =====================================================
       SALVA IN CACHE
    ====================================================== */

    if (cacheKey) {

      imageCache.set(
        cacheKey,
        result
      );

    }


    return result;

  } catch (error) {

    console.warn(
      "Immagine news non disponibile:",
      error
    );


    return {
      imageUrl: null,
      source: "fallback",
      photographer: null,
      photographerUrl: null,
      photoUrl: null,
      query: null
    };

  }
}