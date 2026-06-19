(function () {
    var header = document.querySelector('[data-header]');
    var menuButton = document.querySelector('[data-menu]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 18) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (menuButton && header) {
        menuButton.addEventListener('click', function () {
            header.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                show(index);
                start();
            });
        });

        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-search]');
            var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-row'));
            var activeFilter = 'all';

            function applyFilters() {
                var query = input ? input.value.trim().toLowerCase() : '';
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-category'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-tags')
                    ].join(' ').toLowerCase();
                    var matchedQuery = !query || text.indexOf(query) !== -1;
                    var matchedFilter = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
                    card.hidden = !(matchedQuery && matchedFilter);
                });
            }

            if (input) {
                input.addEventListener('input', applyFilters);
            }

            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    activeFilter = chip.getAttribute('data-filter') || 'all';
                    chips.forEach(function (item) {
                        item.classList.toggle('is-active', item === chip);
                    });
                    applyFilters();
                });
            });

            if (scope.hasAttribute('data-query-page')) {
                var params = new URLSearchParams(window.location.search);
                var q = params.get('q');
                if (q && input) {
                    input.value = q;
                    applyFilters();
                }
            }
        });
    }

    window.initMoviePlayer = function (sourceUrl) {
        var video = document.getElementById('moviePlayer');
        var button = document.getElementById('playButton');
        var hlsInstance = null;
        var attached = false;

        if (!video || !sourceUrl) {
            return;
        }

        function attachSource() {
            if (attached) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    backBufferLength: 30
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
            attached = true;
        }

        function startPlayer() {
            attachSource();
            if (button) {
                button.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', startPlayer);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayer();
            }
        });

        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (button && video.currentTime === 0) {
                button.classList.remove('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    setupHero();
    setupFilters();
})();
