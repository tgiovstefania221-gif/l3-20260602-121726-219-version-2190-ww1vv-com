(function () {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-button]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      const open = mobilePanel.classList.toggle('open');
      body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === currentSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  const video = document.querySelector('[data-video-player]');
  if (video) {
    const source = video.getAttribute('data-src');
    const overlay = document.querySelector('[data-play-overlay]');

    function attachVideo() {
      if (!source || video.dataset.bound === '1') {
        return;
      }
      video.dataset.bound = '1';
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        window.__hlsPlayer = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function startVideo() {
      attachVideo();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
      if (overlay) {
        overlay.classList.add('hidden');
      }
    }

    attachVideo();
    if (overlay) {
      overlay.addEventListener('click', startVideo);
    }
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    });
  }

  const searchInput = document.querySelector('[data-search-input]');
  const typeSelect = document.querySelector('[data-type-select]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

  function applySearch() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedType = typeSelect ? typeSelect.value : '';
    cards.forEach(function (card) {
      const haystack = (card.getAttribute('data-search') || '').toLowerCase();
      const cardType = card.getAttribute('data-type') || '';
      const matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      const matchedType = !selectedType || cardType.indexOf(selectedType) !== -1;
      card.style.display = matchedKeyword && matchedType ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }
  if (typeSelect) {
    typeSelect.addEventListener('change', applySearch);
  }
})();
