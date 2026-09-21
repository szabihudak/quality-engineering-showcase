const navigationToggle = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".primary-nav");
const navigationLinks = document.querySelectorAll(".primary-nav a");

function closeNavigation() {
  navigation?.classList.remove("is-open");
  navigationToggle?.setAttribute("aria-expanded", "false");
  navigationToggle?.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
}

function openNavigation() {
  navigation?.classList.add("is-open");
  navigationToggle?.setAttribute("aria-expanded", "true");
  navigationToggle?.setAttribute("aria-label", "Close navigation");
  document.body.classList.add("nav-open");
}

navigationToggle?.addEventListener("click", () => {
  const isOpen = navigation?.classList.contains("is-open");

  if (isOpen) {
    closeNavigation();
  } else {
    openNavigation();
  }
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeNavigation();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});