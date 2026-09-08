/* =========================================================
   NETLIFY FUNCTION
   RICERCA IMMAGINE PERTINENTE SU PEXELS
========================================================= */

export default async function handler(request) {

  /* =======================================================
     SOLO GET
  ======================================================== */

  if (request.method !== "GET") {

    return Response.json(
      {
        error: "Metodo non consentito"
      },
      {
        status: 405
      }
    );
  }


  /* =======================================================
     PARAMETRI
  ======================================================== */

  const requestUrl =
    new URL(request.url);


  const title =
    requestUrl.searchParams.get(
      "title"
    );


  if (!title) {

    return Response.json(
      {
        imageUrl: null,
        source: "fallback",
        error: "Titolo mancante"
      }
    );
  }


  /* =======================================================
     API KEY
  ======================================================== */

  const apiKey =
    process.env.PEXELS_API_KEY;


  if (!apiKey) {

    console.error(
      "PEXELS_API_KEY non trovata"
    );


    return Response.json(
      {
        imageUrl: null,
        source: "fallback",
        error: "PEXELS_API_KEY non configurata"
      },
      {
        status: 500
      }
    );
  }


  /* =======================================================
     CREA QUERY
  ======================================================== */

  const query =
    title
      .replace(
        /[^a-zA-Z0-9\s-]/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim()
      .split(" ")
      .slice(0, 8)
      .join(" ");


  /* =======================================================
     RICHIESTA PEXELS
  ======================================================== */

  try {

    const pexelsUrl =
      new URL(
        "https://api.pexels.com/v1/search"
      );


    pexelsUrl.searchParams.set(
      "query",
      query
    );


    pexelsUrl.searchParams.set(
      "per_page",
      "1"
    );


    pexelsUrl.searchParams.set(
      "orientation",
      "landscape"
    );


    const response =
      await fetch(
        pexelsUrl,
        {
          headers: {
            Authorization:
              apiKey
          }
        }
      );


    if (!response.ok) {

      const errorText =
        await response.text();


      console.error(
        "Errore Pexels:",
        response.status,
        errorText
      );


      return Response.json(
        {
          imageUrl: null,
          source: "fallback",
          error:
            `Pexels ${response.status}`
        }
      );
    }


    const data =
      await response.json();


    const photo =
      data.photos?.[0];


    if (!photo) {

      return Response.json({
        imageUrl: null,
        source: "fallback",
        query
      });
    }


    /* =====================================================
       RISULTATO
    ====================================================== */

    return Response.json(
      {
        imageUrl:
          photo.src?.large ||
          photo.src?.landscape ||
          photo.src?.medium ||
          null,

        source:
          "pexels",

        photographer:
          photo.photographer ||
          null,

        photographerUrl:
          photo.photographer_url ||
          null,

        photoUrl:
          photo.url ||
          null,

        query
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=86400"
        }
      }
    );


  } catch (error) {

    console.error(
      "Errore ricerca immagine:",
      error
    );


    return Response.json(
      {
        imageUrl: null,
        source: "fallback",
        error:
          error.message
      },
      {
        status: 500
      }
    );
  }
}