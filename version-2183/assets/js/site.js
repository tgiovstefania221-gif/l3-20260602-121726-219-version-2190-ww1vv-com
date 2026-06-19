(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobileMenu = document.querySelector("[data-mobile-menu]");

        if (menuButton && mobileMenu) {
            menuButton.addEventListener("click", function () {
                mobileMenu.classList.toggle("is-open");
            });
        }

        var carousel = document.querySelector("[data-hero-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
            var nextButton = carousel.querySelector("[data-hero-next]");
            var prevButton = carousel.querySelector("[data-hero-prev]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function restart() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(parseInt(dot.getAttribute("data-hero-dot"), 10));
                    restart();
                });
            });

            if (nextButton) {
                nextButton.addEventListener("click", function () {
                    show(current + 1);
                    restart();
                });
            }

            if (prevButton) {
                prevButton.addEventListener("click", function () {
                    show(current - 1);
                    restart();
                });
            }

            restart();
        }

        var pageInput = document.querySelector("[data-search-page-input]");
        if (pageInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            pageInput.value = query;
            var localInput = document.querySelector("[data-local-search]");
            if (localInput && query) {
                localInput.value = query;
            }
        }

        var cardList = document.querySelector("[data-card-list]");
        var localSearch = document.querySelector("[data-local-search]");
        var yearFilter = document.querySelector("[data-year-filter]");

        function filterCards() {
            if (!cardList) {
                return;
            }
            var cards = Array.prototype.slice.call(cardList.querySelectorAll(".movie-card, .rank-row"));
            var keyword = localSearch ? localSearch.value.trim().toLowerCase() : "";
            var year = yearFilter ? yearFilter.value : "";

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-genre") || "",
                    card.textContent || ""
                ].join(" ").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var okKeyword = !keyword || text.indexOf(keyword) !== -1;
                var okYear = !year || cardYear === year;
                card.classList.toggle("is-filtered-out", !(okKeyword && okYear));
            });
        }

        if (localSearch) {
            localSearch.addEventListener("input", filterCards);
        }

        if (yearFilter) {
            yearFilter.addEventListener("change", filterCards);
        }

        filterCards();
    });
})();
