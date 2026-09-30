(() => {
  const modelLink = document.querySelector('a[href="#quality-system"]');

  if (modelLink) {
    modelLink.addEventListener("click", event => {
      const target = document.querySelector("#quality-system");
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center"
      });
    });
  }
})();
