(function() {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    function showSlide(nextIndex) {
      index = nextIndex;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const nextIndex = Number(dot.getAttribute('data-hero-dot')) || 0;
        showSlide(nextIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        showSlide((index + 1) % slides.length);
      }, 5200);
    }
  }

  const searchInputs = Array.from(document.querySelectorAll('[data-search-input]'));

  function currentPrefix() {
    return location.pathname.includes('/movies/') ? '../' : './';
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function renderResults(input) {
    const box = input.closest('.search-box');
    const panel = box ? box.querySelector('[data-search-results]') : null;
    const query = normalize(input.value);

    if (!panel) {
      return;
    }

    if (!query || !window.SEARCH_MOVIES) {
      panel.classList.remove('is-visible');
      panel.innerHTML = '';
      return;
    }

    const prefix = currentPrefix();
    const results = window.SEARCH_MOVIES.filter(function(movie) {
      const haystack = normalize([
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.line
      ].join(' '));
      return haystack.includes(query);
    }).slice(0, 12);

    panel.innerHTML = results.map(function(movie) {
      return [
        '<a class="search-result-item" href="' + prefix + movie.url + '">',
        '<img src="' + prefix + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '">',
        '<span><strong>' + movie.title + '</strong><small>' + movie.year + ' · ' + movie.region + ' · ' + movie.type + '</small></span>',
        '</a>'
      ].join('');
    }).join('');

    panel.classList.toggle('is-visible', results.length > 0);
  }

  searchInputs.forEach(function(input) {
    input.addEventListener('input', function() {
      renderResults(input);
    });
    input.addEventListener('focus', function() {
      renderResults(input);
    });
  });

  document.addEventListener('click', function(event) {
    if (!event.target.closest('.search-box')) {
      document.querySelectorAll('[data-search-results]').forEach(function(panel) {
        panel.classList.remove('is-visible');
      });
    }
  });

  const yearFilter = document.querySelector('[data-filter-year]');
  const typeFilter = document.querySelector('[data-filter-type]');
  const resetFilter = document.querySelector('[data-reset-filter]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

  function applyFilters() {
    const year = yearFilter ? yearFilter.value : '';
    const type = typeFilter ? typeFilter.value : '';

    cards.forEach(function(card) {
      const matchesYear = !year || card.getAttribute('data-year') === year;
      const matchesType = !type || card.getAttribute('data-type') === type;
      card.style.display = matchesYear && matchesType ? '' : 'none';
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }

  if (resetFilter) {
    resetFilter.addEventListener('click', function() {
      if (yearFilter) {
        yearFilter.value = '';
      }
      if (typeFilter) {
        typeFilter.value = '';
      }
      applyFilters();
    });
  }

  document.querySelectorAll('img').forEach(function(image) {
    image.addEventListener('error', function() {
      image.style.opacity = '0.18';
    }, { once: true });
  });
}());
