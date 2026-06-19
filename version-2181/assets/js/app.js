(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMenu() {
    var button = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", menu.classList.contains("is-open") ? "true" : "false");
    });
  }

  function setupHero() {
    var slides = all(".hero-slide");
    var dots = all(".hero-dot");
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    function start() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });
    show(0);
    start();
  }

  function populateSelect(select, cards) {
    var field = select.getAttribute("data-options-field");
    if (!field) {
      return;
    }
    var values = [];
    cards.forEach(function (card) {
      var value = card.getAttribute("data-" + field);
      if (value && values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    values.sort(function (a, b) {
      return String(a).localeCompare(String(b), "zh-Hans-CN");
    });
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function setupFilters() {
    var container = document.querySelector("[data-searchable-list]");
    if (!container) {
      return;
    }
    var cards = all(".movie-card", container);
    var input = document.querySelector("[data-filter-input]");
    var selects = all("[data-filter-select]");
    var empty = document.querySelector(".empty-state");
    selects.forEach(function (select) {
      populateSelect(select, cards);
    });
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (input && query) {
      input.value = query;
    }
    function apply() {
      var q = normalize(input ? input.value : "");
      var active = selects.map(function (select) {
        return {
          field: select.getAttribute("data-filter-select"),
          value: normalize(select.value)
        };
      });
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.textContent
        ].join(" "));
        var matched = !q || haystack.indexOf(q) !== -1;
        active.forEach(function (item) {
          if (!item.value) {
            return;
          }
          if (normalize(card.getAttribute("data-" + item.field)) !== item.value) {
            matched = false;
          }
        });
        card.style.display = matched ? "" : "none";
        if (matched) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", shown === 0);
      }
    }
    if (input) {
      input.addEventListener("input", apply);
    }
    selects.forEach(function (select) {
      select.addEventListener("change", apply);
    });
    apply();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
