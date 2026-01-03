/**
 * HobbyVerse Store - Main JavaScript
 * Handles interactivity for Contact Form, Dark Mode, Product Filtering, FAQ, and Modals.
 */

document.addEventListener("DOMContentLoaded", function () {
  /* ==========================================================================
       1. DARK MODE TOGGLE
       ========================================================================== */
  initDarkMode();

  /* ==========================================================================
       2. CONTACT FORM VALIDATION
       ========================================================================== */
  if (document.getElementById("contactForm")) {
    initContactForm();
  }

  /* ==========================================================================
       3. PRODUCT CATEGORY FILTER
       ========================================================================== */
  // Check if we are on the products page by looking for the filter group
  const filterGroup = document.querySelector('.btn-group[aria-label="Filter Kategori"]');
  if (filterGroup) {
    initProductFilter(filterGroup);
  }

  /* ==========================================================================
       4. FAQ ACCORDION INTERACTION
       ========================================================================== */
  initFAQInteraction();

  /* ==========================================================================
       5. SIMPLE MODAL / ALERT INTERACTION
       ========================================================================== */
  initSimulationAlerts();
});

/**
 * Feature 1: Dark Mode Toggle
 * Adds a toggle button to the navbar and manages the 'dark-mode' class on body.
 * Saves preference to localStorage.
 */
function initDarkMode() {
  const body = document.body;
  const navbarNav = document.querySelector(".navbar-nav.ms-auto");

  // Create Dark Mode Button
  const darkModeLi = document.createElement("li");
  darkModeLi.className = "nav-item ms-lg-3 mt-2 mt-lg-0 d-flex align-items-center";

  const darkModeBtn = document.createElement("button");
  darkModeBtn.className = "btn theme-toggle-btn rounded-circle";
  darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  darkModeBtn.setAttribute("aria-label", "Toggle Dark Mode");

  darkModeLi.appendChild(darkModeBtn);

  // Append to navbar if it exists
  if (navbarNav) {
    navbarNav.appendChild(darkModeLi);
  }

  // Check Local Storage
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";
  if (isDarkMode) {
    enableDarkMode();
  }

  // Toggle Logic
  darkModeBtn.addEventListener("click", function () {
    // Add rotation animation class
    darkModeBtn.classList.add("rotate-icon");
    setTimeout(() => darkModeBtn.classList.remove("rotate-icon"), 500);

    if (body.classList.contains("dark-mode")) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  function enableDarkMode() {
    body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
    darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    // Button styling is now handled by CSS via body.dark-mode

    // Inject basic dark mode styles if not present in CSS
    if (!document.getElementById("darkModeStyles")) {
      const style = document.createElement("style");
      style.id = "darkModeStyles";
      style.textContent = `
                .dark-mode { background-color: #121212; color: #e0e0e0; }
                .dark-mode .bg-light { background-color: #1e1e1e !important; color: #e0e0e0 !important; }
                .dark-mode .card { background-color: #1e1e1e; border-color: #333; color: #e0e0e0; }
                .dark-mode .text-muted { color: #a0a0a0 !important; }
                .dark-mode .list-group-item { background-color: #1e1e1e; border-color: #333; color: #e0e0e0; }
                .dark-mode .accordion-button:not(.collapsed) { background-color: #333; color: #fff; }
                .dark-mode .accordion-button { background-color: #1e1e1e; color: #e0e0e0; }
                .dark-mode .accordion-item { border-color: #333; }
            `;
      document.head.appendChild(style);
    }
  }

  function disableDarkMode() {
    body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
    darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}
function initContactForm() {
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Reset alert
    if (alertBox) alertBox.classList.add("d-none");

    // Check validity using Bootstrap's built-in validation API
    if (form.checkValidity()) {
      // Custom Email Validation (Regex)
      const emailInput = document.getElementById("email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailInput.value)) {
        emailInput.setCustomValidity("Format email tidak valid.");
        emailInput.reportValidity();
        form.classList.add("was-validated");
        return;
      } else {
        emailInput.setCustomValidity("");
      }

      // If valid, show success message
      if (alertBox) {
        alertBox.classList.remove("d-none");
        alertBox.classList.remove("alert-danger");
        alertBox.classList.add("alert-success");
        alertBox.textContent = "Terima kasih! Pesan Anda telah kami terima. Kami akan segera menghubungi Anda.";

        // Reset form after delay
        setTimeout(() => {
          form.reset();
          form.classList.remove("was-validated");
          alertBox.classList.add("d-none");
        }, 5000);
      } else {
        alert("Terima kasih! Pesan Anda telah kami terima.");
        form.reset();
      }
    } else {
      form.classList.add("was-validated");
    }
  });
}

/**
 * Feature 3: Product Category Filter
 * Filters product cards based on category buttons.
 * Assumes buttons have text content matching categories, and cards have badges or data attributes.
 */
function initProductFilter(filterGroup) {
  const buttons = filterGroup.querySelectorAll(".btn");
  const productCards = document.querySelectorAll(".col-md-6.col-lg-4"); // Select product columns

  // Helper: Add data-category to products based on their badge text if not present
  productCards.forEach((card) => {
    if (!card.hasAttribute("data-category")) {
      const badge = card.querySelector(".badge");
      if (badge) {
        card.setAttribute("data-category", badge.textContent.trim());
      }
    }
  });

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      buttons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const category = this.textContent.trim();

      productCards.forEach((card) => {
        const productCategory = card.getAttribute("data-category");

        // Show all if "Semua" is clicked, otherwise check match
        if (category === "Semua" || productCategory === category) {
          card.style.display = "block";
          // Add animation class for smooth effect
          card.classList.add("fade-in");
          setTimeout(() => card.classList.remove("fade-in"), 500);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/**
 * Feature 4: FAQ Accordion Interaction
 * Ensures only one <details> element is open at a time (if used).
 * Also adds a console log for Bootstrap accordion interactions.
 */
function initFAQInteraction() {
  // Logic for semantic <details> elements
  const detailsElements = document.querySelectorAll("details");

  detailsElements.forEach((detail) => {
    detail.addEventListener("toggle", function () {
      if (this.open) {
        // Close all other details
        detailsElements.forEach((otherDetail) => {
          if (otherDetail !== this && otherDetail.open) {
            otherDetail.removeAttribute("open");
          }
        });
      }
    });
  });

  // Logic for Bootstrap Accordion (Optional enhancement)
  const accordionItems = document.querySelectorAll(".accordion-button");
  accordionItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Log interaction for debugging or analytics
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      console.log(`FAQ Item Clicked: ${this.textContent.trim()} - Expanded: ${isExpanded}`);
    });
  });
}

/**
 * Feature 5: Simple Modal / Alert Interaction
 * Intercepts clicks on "Lihat Detail", "Beli", or "Promo" buttons to show a simulation message.
 */
function initSimulationAlerts() {
  // Select buttons that should trigger the simulation alert
  // We exclude navigation links and filter buttons
  const simulationButtons = document.querySelectorAll("a.btn, button.btn");

  simulationButtons.forEach((btn) => {
    // Filter logic: Apply only to specific actions
    const text = btn.textContent.trim().toLowerCase();
    const href = btn.getAttribute("href");

    // Check if it's a "dummy" action button
    const isActionBtn = text.includes("beli") || text.includes("keranjang") || text.includes("favorit") || href === "#" || href === "";

    if (isActionBtn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        alert("Fitur ini hanya simulasi (tanpa backend). Terima kasih telah mencoba!");
      });
    }
  });
}
