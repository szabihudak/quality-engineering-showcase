(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");

  const storedTheme = localStorage.getItem("showcase-theme");

  if (storedTheme === "dark" || storedTheme === "light") {
    root.dataset.theme = storedTheme;
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "dark"
          ? "light"
          : "dark";

      root.dataset.theme = nextTheme;
      localStorage.setItem("showcase-theme", nextTheme);
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target;
          const delay = Number(element.dataset.delay || 0);

          window.setTimeout(() => {
            element.classList.add("is-visible");
          }, delay);

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const interactiveCards = document.querySelectorAll(
    ".bento-card, .work-card, .flow-console",
  );

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    interactiveCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (window.innerWidth < 900) {
          return;
        }

        const rect = card.getBoundingClientRect();

        const x =
          ((event.clientX - rect.left) / rect.width - 0.5) * 2;

        const y =
          ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        card.style.transform =
          `perspective(900px) rotateX(${y * -1.2}deg) rotateY(${x * 1.2}deg) translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }
})();