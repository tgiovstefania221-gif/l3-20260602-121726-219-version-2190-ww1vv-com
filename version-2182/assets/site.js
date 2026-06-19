document.addEventListener('DOMContentLoaded', function () {
  var navButton = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-filter="keyword"]');
  var yearSelect = document.querySelector('[data-filter="year"]');
  var categorySelect = document.querySelector('[data-filter="category"]');
  var clearButton = document.querySelector('[data-filter="clear"]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var emptyState = document.querySelector('.empty-state');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(searchInput && searchInput.value);
    var year = yearSelect ? yearSelect.value : '';
    var category = categorySelect ? categorySelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.category,
        card.dataset.year
      ].join(' '));
      var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
      var yearMatch = !year || card.dataset.year === year;
      var categoryMatch = !category || card.dataset.category === category;
      var show = keywordMatch && yearMatch && categoryMatch;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : 'block';
    }
  }

  [searchInput, yearSelect, categorySelect].forEach(function (node) {
    if (node) {
      node.addEventListener('input', applyFilters);
      node.addEventListener('change', applyFilters);
    }
  });

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
      }
      if (yearSelect) {
        yearSelect.value = '';
      }
      if (categorySelect) {
        categorySelect.value = '';
      }
      applyFilters();
    });
  }
});
