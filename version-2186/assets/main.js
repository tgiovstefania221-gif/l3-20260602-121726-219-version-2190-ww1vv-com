(function () {
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var opened = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  document.querySelectorAll(".hero-carousel").forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector(".hero-prev");
    var next = carousel.querySelector(".hero-next");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });
    show(0);
    restart();
  });

  document.querySelectorAll(".filter-input").forEach(function (input) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("search") || "";
    if (initial) {
      input.value = initial;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card-link"));
    function applyFilter() {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var content = (card.getAttribute("data-keywords") || card.textContent || "").toLowerCase();
        card.style.display = !keyword || content.indexOf(keyword) !== -1 ? "" : "none";
      });
    }
    input.addEventListener("input", applyFilter);
    applyFilter();
  });
})();

function initMoviePlayer(videoId, buttonId, posterId, sourceUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var poster = document.getElementById(posterId);
  if (!video || !sourceUrl) {
    return;
  }
  var prepared = false;
  function playVideo() {
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }
  function prepare() {
    if (poster) {
      poster.classList.add("is-hidden");
    }
    if (prepared) {
      playVideo();
      return;
    }
    prepared = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      playVideo();
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
      video._hls = hls;
    } else {
      video.src = sourceUrl;
      playVideo();
    }
  }
  if (poster) {
    poster.addEventListener("click", prepare);
  }
  if (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      prepare();
    });
  }
  video.addEventListener("click", function () {
    if (!prepared) {
      prepare();
    }
  });
}
