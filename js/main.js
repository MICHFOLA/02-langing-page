const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.querySelector(".sr-only").textContent = isExpanded ? "Open menu" : "Close menu";
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.querySelector(".sr-only").textContent = "Open menu";
      primaryNav.classList.remove("is-open");
    });
  });
}

const billingOptions = document.querySelectorAll(".billing-option");
const prices = document.querySelectorAll(".price-amount");
const billingPeriods = document.querySelectorAll(".price > span:last-child");

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const period = option.dataset.period;
    billingOptions.forEach((button) => {
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

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

if (signupForm && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    formMessage.textContent = "Thanks for reaching out! Our studio team will be in touch within two working days.";
    signupForm.reset();
  });
}

const yearLabel = document.querySelector("#current-year");
if (yearLabel) yearLabel.textContent = String(new Date().getFullYear());
