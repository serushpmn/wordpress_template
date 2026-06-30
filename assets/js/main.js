const menuToggle = document.querySelector("[data-menu-toggle]");
const siteMenu = document.querySelector("#site-menu");

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
