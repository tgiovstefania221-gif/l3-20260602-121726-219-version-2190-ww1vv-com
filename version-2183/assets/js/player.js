(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var video = document.querySelector("video[data-m3u8]");
        var button = document.querySelector("[data-play-button]");
        var attached = false;

        function attach() {
            if (!video || attached) {
                return;
            }
            var src = video.getAttribute("data-m3u8");
            if (!src) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            } else if (window.Hls) {
                var hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
            } else {
                video.src = src;
            }
            attached = true;
        }

        function start() {
            attach();
            if (button) {
                button.classList.add("is-hidden");
            }
            if (video) {
                var action = video.play();
                if (action && action.catch) {
                    action.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                if (button) {
                    button.classList.add("is-hidden");
                }
            });
        }
    });
})();
