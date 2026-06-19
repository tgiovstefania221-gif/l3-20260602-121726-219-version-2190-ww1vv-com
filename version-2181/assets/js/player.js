(function () {
  function initPlayer() {
    var video = document.getElementById("movie-video");
    var start = document.getElementById("player-start");
    var src = window.__stream__;
    if (!video || !start || !src) {
      return;
    }
    var ready = false;
    var hls = null;
    function attach() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }
    function play() {
      attach();
      start.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }
    start.addEventListener("click", play);
    video.addEventListener("play", function () {
      start.classList.add("is-hidden");
    });
    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlayer);
  } else {
    initPlayer();
  }
})();
