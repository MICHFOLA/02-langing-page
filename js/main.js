/**
 * Initializes the responsive navigation and its keyboard behavior.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (!menuToggle || !primaryNav) return;

  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Open menu";
    primaryNav.classList.toggle("is-open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
};

/**
 * Animates FAQ panels and ensures that at most one answer is open.
 */
const initAccordion = () => {
  const questions = document.querySelectorAll(".faq-question");

  const setPanelOpen = (button, isOpen) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    button.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      panel.hidden = false;
      panel.style.height = "0px";
      requestAnimationFrame(() => {
        panel.style.height = `${panel.scrollHeight}px`;
      });
      panel.addEventListener("transitionend", () => {
        if (button.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
      }, { once: true });
      return;
    }

    panel.style.height = `${panel.getBoundingClientRect().height}px`;
    requestAnimationFrame(() => {
      panel.style.height = "0px";
    });
    panel.addEventListener("transitionend", () => {
      if (button.getAttribute("aria-expanded") === "false") panel.hidden = true;
    }, { once: true });
  };

  questions.forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";
    if (panel) {
      panel.hidden = !isOpen;
      panel.style.height = isOpen ? "auto" : "0px";
    }

    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";

      if (shouldOpen) {
        questions.forEach((otherButton) => {
          if (otherButton !== button && otherButton.getAttribute("aria-expanded") === "true") {
            setPanelOpen(otherButton, false);
          }
        });
      }

      setPanelOpen(button, shouldOpen);
    });
  });
};

/**
 * Updates displayed prices and billing controls for the selected period.
 */
const initPricingToggle = () => {
  const options = document.querySelectorAll(".billing-option");
  const prices = document.querySelectorAll(".price-amount");
  const billingPeriods = document.querySelectorAll(".price > span:last-child");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const period = option.dataset.period;

      options.forEach((button) => {
        const isActive = button === option;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      prices.forEach((price) => {
        price.textContent = `$${price.dataset[period]}`;
      });

      billingPeriods.forEach((label) => {
        label.textContent = period === "yearly" ? "/ month, billed yearly" : "/ month";
      });
    });
  });
};

/**
 * Adds a shadow to the sticky header once the page is scrolled.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeaderShadow = () => {
    header.classList.toggle("has-shadow", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Displays the current year in the footer.
 */
const initFooterYear = () => {
  const yearLabel = document.querySelector("#current-year");
  if (yearLabel) yearLabel.textContent = String(new Date().getFullYear());
};

/**
 * Shows an inline confirmation after a valid sign-up form submission.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");

  if (!signupForm || !formMessage) return;

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;

    formMessage.textContent = "Thanks for reaching out! Our studio team will be in touch within two working days.";
    signupForm.reset();
  });
};

/**
 * Initializes all page interactions after the document is ready.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initFooterYear();
  initSignupForm();
};

document.addEventListener("DOMContentLoaded", init);
