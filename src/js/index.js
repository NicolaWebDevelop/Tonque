import "../scss/main.scss";

import "./backtotop.js";
import "./notizie.js";


document.addEventListener(
  "DOMContentLoaded",
  () => {

    const openBtn =
      document.getElementById("open-legal");

    const closeBtn =
      document.getElementById("close-legal");

    const modal =
      document.getElementById("legal-modal");


    if (
      !openBtn ||
      !closeBtn ||
      !modal
    ) {
      return;
    }


    openBtn.addEventListener(
      "click",
      () => {
        modal.classList.add("active");
      }
    );


    closeBtn.addEventListener(
      "click",
      () => {
        modal.classList.remove("active");
      }
    );


    modal.addEventListener(
      "click",
      event => {

        if (event.target === modal) {
          modal.classList.remove("active");
        }

      }
    );

  }
);