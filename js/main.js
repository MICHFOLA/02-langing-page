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

  const fields = {
    name: {
      input: signupForm.elements.name,
      error: document.querySelector("#name-error"),
      validate: (value) => value.trim().length >= 2 ? "" : "Please enter at least 2 characters for your name."
    },
    email: {
      input: signupForm.elements.email,
      error: document.querySelector("#email-error"),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address."
    },
    plan: {
      input: signupForm.elements.plan,
      error: document.querySelector("#plan-error"),
      validate: (value) => value ? "" : "Please choose a plan."
    },
    terms: {
      input: signupForm.elements.terms,
      error: document.querySelector("#terms-error"),
      validate: (value) => value ? "" : "Please agree to the terms to continue."
    }
  };
  let hasSubmitted = false;

  const updateField = (field) => {
    const value = field.input.type === "checkbox" ? field.input.checked : field.input.value;
    const errorMessage = field.validate(value);
    field.input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    field.error.textContent = errorMessage;
    field.error.hidden = !errorMessage;
    return !errorMessage;
  };

  Object.values(fields).forEach((field) => {
    const eventName = field.input.type === "checkbox" || field.input.tagName === "SELECT" ? "change" : "input";
    field.input.addEventListener(eventName, () => {
      if (hasSubmitted) updateField(field);
      formMessage.textContent = "";
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hasSubmitted = true;
    formMessage.textContent = "";

    const isValid = Object.values(fields).reduce((valid, field) => updateField(field) && valid, true);
    if (!isValid) {
      Object.values(fields).find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
      return;
    }

    const email = fields.email.input.value.trim();
    let signups;

    try {
      const storedSignups = localStorage.getItem("signups");
      signups = storedSignups === null ? [] : JSON.parse(storedSignups);
      if (!Array.isArray(signups)) throw new TypeError("Stored signups must be an array.");
    } catch {
      formMessage.textContent = "We couldn't access your saved sign-ups. Please try again.";
      return;
    }

    if (signups.some((signup) => signup && typeof signup.email === "string" && signup.email.toLowerCase() === email.toLowerCase())) {
      formMessage.textContent = "You've already signed up";
      return;
    }

    signups.push({
      name: fields.name.input.value.trim(),
      email,
      plan: fields.plan.input.value,
      createdAt: new Date().toISOString()
    });

    try {
      localStorage.setItem("signups", JSON.stringify(signups));
    } catch {
      formMessage.textContent = "We couldn't save your sign-up. Please try again.";
      return;
    }

    signupForm.reset();
    hasSubmitted = false;
    Object.values(fields).forEach((field) => {
      field.input.setAttribute("aria-invalid", "false");
      field.error.textContent = "";
      field.error.hidden = true;
    });
    formMessage.textContent = "Thanks for reaching out! Our studio team will be in touch within two working days.";
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
