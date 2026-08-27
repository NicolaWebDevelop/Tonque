import '../scss/main.scss';
import './backtotop.js';
import './notizie.js';

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-legal");
  const closeBtn = document.getElementById("close-legal");
  const modal = document.getElementById("legal-modal");

  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
});
