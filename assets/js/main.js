const menuToggle = document.querySelector("[data-menu-toggle]");
const siteMenu = document.querySelector("#site-menu");
const headerActions = document.querySelector(".header-actions");
const STORE_PHONE_DISPLAY = "۰۲۱-۸۸۸۸۶۹۵۹";
const STORE_PHONE_TEL = "02188886959";
const CONTACT_PAGE = "contact.html";

function getStoredTheme() {
  try {
    return localStorage.getItem("almas-theme");
  } catch {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("almas-theme", theme);
  } catch {
    // Storage can be unavailable in private contexts.
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

const preferredDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(getStoredTheme() || (preferredDark ? "dark" : "light"));

if (headerActions) {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.setAttribute("aria-label", "تغییر حالت روشن و تاریک");
  themeToggle.innerHTML = `
    <svg class="theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 14.4A8.2 8.2 0 0 1 9.6 3a8.6 8.6 0 1 0 11.4 11.4Z"/></svg>
    <svg class="theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1.2h2V21a1 1 0 0 1-1 1Zm0-17.8h-1V3a1 1 0 1 1 2 0v1.2h-1ZM4.2 13H3a1 1 0 1 1 0-2h1.2v2ZM21 13h-1.2v-2H21a1 1 0 1 1 0 2ZM6.3 7.7 5.5 6.9a1 1 0 0 1 1.4-1.4l.8.8-1.4 1.4Zm11.2 11.2-.8-.8 1.4-1.4.8.8a1 1 0 0 1-1.4 1.4Zm-.8-12.6.8-.8a1 1 0 1 1 1.4 1.4l-.8.8-1.4-1.4ZM5.5 17.5l.8-.8 1.4 1.4-.8.8a1 1 0 0 1-1.4-1.4Z"/></svg>
  `;
  headerActions.insertBefore(themeToggle, menuToggle || headerActions.firstChild);

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  });
}

const floatingContact = document.createElement("a");
floatingContact.className = "floating-contact";
floatingContact.setAttribute("aria-label", "تماس با ما");
floatingContact.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.1.6.7 0 1.3.6 1.3 1.3v3.5c0 .7-.6 1.3-1.3 1.3C10.4 21.6 2.4 13.6 2.4 3.3 2.4 2.6 3 2 3.7 2h3.5c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.6 4.1.1.4 0 .9-.3 1.2l-2.2 2.2Z"/></svg>
  <span>تماس با ما</span>
  <span class="floating-contact__phone">${STORE_PHONE_DISPLAY}</span>
`;
document.body.append(floatingContact);

const mobileContactQuery = window.matchMedia?.("(max-width: 720px)");

function updateFloatingContactHref() {
  const isMobile = Boolean(mobileContactQuery?.matches);
  floatingContact.href = isMobile ? `tel:${STORE_PHONE_TEL}` : CONTACT_PAGE;
}

updateFloatingContactHref();
mobileContactQuery?.addEventListener?.("change", updateFloatingContactHref);

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const filterPanel = document.querySelector("[data-filter-panel]");
const filterOpen = document.querySelector("[data-filter-open]");
const filterClosers = document.querySelectorAll("[data-filter-close]");
const filterBackdrop = document.querySelector(".filter-backdrop");

function setFilterState(isOpen) {
  if (!filterPanel) return;
  filterPanel.classList.toggle("is-open", isOpen);
  filterBackdrop?.classList.toggle("is-open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}

filterOpen?.addEventListener("click", () => setFilterState(true));
filterClosers.forEach((button) => {
  button.addEventListener("click", () => setFilterState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setFilterState(false);
  }
});

const galleryMain = document.querySelector("[data-gallery-main]");
const galleryThumbs = document.querySelectorAll("[data-gallery-thumb]");

galleryThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const src = thumb.getAttribute("data-gallery-thumb");
    if (!galleryMain || !src) return;
    galleryMain.src = src;
    galleryThumbs.forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");
  });
});

document.querySelectorAll(".quantity-control").forEach((control) => {
  const input = control.querySelector("input");
  const minus = control.querySelector("[data-qty-minus]");
  const plus = control.querySelector("[data-qty-plus]");

  minus?.addEventListener("click", () => {
    if (!input) return;
    input.value = String(Math.max(1, Number(input.value || 1) - 1));
  });

  plus?.addEventListener("click", () => {
    if (!input) return;
    input.value = String(Number(input.value || 1) + 1);
  });
});

const cartCounts = document.querySelectorAll("[data-cart-count]");
let cartCount = Number(cartCounts[0]?.textContent?.replace(/\D/g, "") || 2);

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    cartCount += 1;
    cartCounts.forEach((item) => {
      item.textContent = toPersianDigits(cartCount);
    });
    button.textContent = "به سبد خرید اضافه شد";
    window.setTimeout(() => {
      button.textContent = "افزودن به سبد خرید";
    }, 1800);
  });
});

const megaToggles = document.querySelectorAll("[data-mega-toggle]");

function closeMegaMenus() {
  megaToggles.forEach((toggle) => {
    toggle.closest(".nav-item")?.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

megaToggles.forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const navItem = toggle.closest(".nav-item");
    if (!navItem) return;
    const isOpen = navItem.classList.toggle("is-open");
    megaToggles.forEach((item) => {
      if (item !== toggle) {
        item.closest(".nav-item")?.classList.remove("is-open");
        item.setAttribute("aria-expanded", "false");
      }
    });
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest?.(".nav-item--mega")) {
    closeMegaMenus();
  }
});

const modals = document.querySelectorAll(".modal");

function setModalState(modal, isOpen) {
  modal.classList.toggle("is-open", isOpen);
  modal.setAttribute("aria-hidden", String(!isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.getAttribute("data-modal-open"));
    if (modal) setModalState(modal, true);
  });
});

modals.forEach((modal) => {
  modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", () => setModalState(modal, false));
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      setModalState(modal, false);
    }
  });
});

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.querySelectorAll(".accordion__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion__item");
      item?.classList.toggle("is-open");
    });
  });
});

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const tabButtons = tabs.querySelectorAll("[data-tab-target]");
  const tabPanels = tabs.querySelectorAll(".tabs__panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = tabs.querySelector(`#${button.getAttribute("data-tab-target")}`);
      tabButtons.forEach((item) => item.classList.remove("is-active"));
      tabPanels.forEach((panel) => panel.classList.remove("is-active"));
      button.classList.add("is-active");
      target?.classList.add("is-active");
    });
  });
});

let toastStack;

function showToast(message) {
  if (!toastStack) {
    toastStack = document.createElement("div");
    toastStack.className = "toast-stack";
    toastStack.setAttribute("aria-live", "polite");
    document.body.append(toastStack);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastStack.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.getAttribute("data-toast") || "عملیات با موفقیت انجام شد.");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMegaMenus();
  modals.forEach((modal) => setModalState(modal, false));
});
