(() => {
  "use strict";

  // Sửa tiêu đề/nghệ sĩ ở đây; đặt file MP3 tương ứng trong thư mục music/.
  const TRACKS = [
    { title: "Em Xinh", artist: "MONO, Onionn", src: "music/track-01.mp3" },
    { title: "Nàng Công Chúa Nhỏ", artist: "buitruonglinh", src: "music/track-02.mp3" },
    { title: "Chăm Hoa", artist: "MONO", src: "music/track-03.mp3" },
    { title: "Em Là", artist: "MONO, Onionn", src: "music/track-04.mp3" },
    { title: "Chăm Em Một Đời", artist: "Đức Phúc", src: "music/track-05.mp3" }
  ];

  const init = () => {
    const body = document.body;
    const rainLayer = document.getElementById("glass-rain");
    const modal = document.getElementById("letter-modal");
    const modalAudio = document.getElementById("modal-audio");
    const letterParagraph = document.querySelector("#letter-content p");
    const closeButton = document.getElementById("close-letter");
    const backdrop = document.getElementById("modal-backdrop");
    const playerPanel = document.getElementById("music-panel");
    const title = document.getElementById("track-title");
    const artist = document.getElementById("track-artist");
    const status = document.getElementById("track-status");
    const playButton = document.getElementById("toggle-playback");
    const previousButton = document.getElementById("previous-track");
    const nextButton = document.getElementById("next-track");
    const seekBar = document.getElementById("seek-bar");
    const volumeControl = document.getElementById("volume-control");

    if (!rainLayer || !modal || !modalAudio) return;

    let currentTrack = 0;
    let lastFocusedElement = null;
    let currentSourceLoaded = false;
    const letterMessage = letterParagraph ? letterParagraph.textContent : "";
    let typingTimer = null;

    function typeLetterMessage() {
      if (!letterParagraph) return;
      if (typingTimer !== null) window.clearTimeout(typingTimer);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        letterParagraph.textContent = letterMessage;
        typingTimer = null;
        return;
      }

      const characters = Array.from(letterMessage);
      let index = 0;
      letterParagraph.textContent = "";

      const typeNextCharacter = () => {
        if (modal.hidden || index >= characters.length) {
          typingTimer = null;
          return;
        }

        letterParagraph.textContent += characters[index];
        index += 1;
        typingTimer = window.setTimeout(typeNextCharacter, 34);
      };

      typeNextCharacter();
    }

    /* [FIND: HOA NỞ TRƯỚC — THƯ RƠI SAU] */

// Đợi một chút rồi bắt đầu hiệu ứng hoa mọc
const FLOWER_START_DELAY_MS = 850;

// Chờ hoa mọc gần hoàn chỉnh rồi mới cho thư rơi
const LETTER_RAIN_DELAY_MS = 6500;

window.setTimeout(() => {
  // Bắt đầu hiệu ứng hoa nở
  body.classList.remove("not-loaded");

  // Khi hoa đã mọc xong, bắt đầu cho các lá thư rơi
  window.setTimeout(() => {
    createLetterRain(rainLayer, openLetter);
  }, LETTER_RAIN_DELAY_MS);

}, FLOWER_START_DELAY_MS);

    const formatTrackName = (track) => track.title || "Bài hát";

    function updatePlayButton(playing) {
      playButton.classList.toggle("is-playing", playing);
      playerPanel.classList.toggle("is-playing", playing);
      playButton.setAttribute("aria-label", playing ? "Tạm dừng nhạc" : "Phát nhạc");
      playButton.setAttribute("title", playing ? "Tạm dừng" : "Phát nhạc");
    }

    function setStatus(message) {
      if (status) status.textContent = message;
    }
    /* [FIND: UPDATE SLIDER COLOR FILL] */
    function updateRangeFill(range) {
      const min = Number(range.min || 0);
      const max = Number(range.max || 100);
      const value = Number(range.value || 0);

      const percent = max > min
        ? ((value - min) / (max - min)) * 100
        : 0;

      range.style.setProperty(
        "--range-fill",
        `${Math.max(0, Math.min(100, percent))}%`
      );
    }
    function loadTrack(index) {
      currentTrack = (index + TRACKS.length) % TRACKS.length;
      const track = TRACKS[currentTrack];
      title.textContent = formatTrackName(track);
      artist.textContent = track.artist || "";
      seekBar.value = "0";
      updateRangeFill(seekBar);
      currentSourceLoaded = false;
      modalAudio.pause();
      modalAudio.src = track.src;
      modalAudio.load();
      updatePlayButton(false);
      setStatus(`Nguồn nhạc: ${track.src}`);
    }

    async function playCurrentTrack() {
      if (!modalAudio.src) loadTrack(currentTrack);
      try {
        await modalAudio.play();
        updatePlayButton(true);
        setStatus("Đang phát nhạc");
      } catch (error) {
        updatePlayButton(false);
        // Lỗi thường gặp nhất ở đây là người dùng chưa thêm file MP3 tương ứng.
        setStatus(`Chưa phát được — hãy thêm ${TRACKS[currentTrack].src}`);
      }
    }

    function pauseTrack() {
      modalAudio.pause();
      updatePlayButton(false);
      if (currentSourceLoaded) setStatus("Đã tạm dừng");
    }

    function changeTrack(direction) {
      const shouldResume = !modalAudio.paused && !modalAudio.ended;
      loadTrack(currentTrack + direction);
      if (shouldResume) playCurrentTrack();
    }

    function openLetter() {
      lastFocusedElement = document.activeElement;
      if (!modalAudio.src) loadTrack(currentTrack);
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      body.classList.add("modal-open");
      typeLetterMessage();
      modal.querySelector(".letter-card").focus({ preventScroll: true });
      // Nhạc chỉ được thử phát sau cú nhấp mở thư, không tự phát ở trang nền.
      playCurrentTrack();
    }

    function closeLetter() {
      if (typingTimer !== null) {
        window.clearTimeout(typingTimer);
        typingTimer = null;
      }
      modalAudio.pause();
      updatePlayButton(false);
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      body.classList.remove("modal-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
      }
    }

    // Audio controls
    playButton.addEventListener("click", () => {
      if (modalAudio.paused) playCurrentTrack();
      else pauseTrack();
    });
    previousButton.addEventListener("click", () => changeTrack(-1));
    nextButton.addEventListener("click", () => changeTrack(1));

    volumeControl.value = "0.8";
    updateRangeFill(volumeControl);
    updateRangeFill(seekBar);
    modalAudio.volume = 0.8;
    volumeControl.addEventListener("input", () => {
      modalAudio.volume = Number(volumeControl.value);
      updateRangeFill(volumeControl);
    });

    seekBar.addEventListener("input", () => {
      if (Number.isFinite(modalAudio.duration) && modalAudio.duration > 0) {
        modalAudio.currentTime = (Number(seekBar.value) / 100) * modalAudio.duration;
      }
    });

    modalAudio.addEventListener("loadedmetadata", () => {
      currentSourceLoaded = true;
      setStatus("Sẵn sàng phát");
    });
    modalAudio.addEventListener("timeupdate", () => {
      if (Number.isFinite(modalAudio.duration) && modalAudio.duration > 0) {
        seekBar.value = String((modalAudio.currentTime / modalAudio.duration) * 100);
      }
    });
    modalAudio.addEventListener("playing", () => {
      updatePlayButton(true);
      setStatus("Đang phát nhạc");
    });
    modalAudio.addEventListener("pause", () => updatePlayButton(false));
    modalAudio.addEventListener("ended", () => {
      loadTrack(currentTrack + 1);
      playCurrentTrack();
    });
    modalAudio.addEventListener("error", () => {
      currentSourceLoaded = false;
      updatePlayButton(false);
      setStatus(`Chưa tìm thấy file ${TRACKS[currentTrack].src}`);
    });

    closeButton.addEventListener("click", closeLetter);
    backdrop.addEventListener("click", closeLetter);
    document.addEventListener("keydown", (event) => {
      if (modal.hidden) return;
      if (event.key === "Escape") closeLetter();
      if (event.key === "Tab") {
        const focusable = modal.querySelectorAll('button:not([disabled]), input:not([disabled])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Track zero is loaded only when a letter is opened, so the background page stays silent.
  };

  function createLetterRain(layer, onOpen) {
    if (!layer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.matchMedia("(max-width: 600px)").matches;
    const count = reduceMotion ? 0 : (smallScreen ? 8 : 12);
    // Cùng chu kỳ và chia pha đều để thư lần lượt đi xuống, không dồn thành cụm.
    const duration = 19.5;
    const fragment = document.createDocumentFragment();
    const envelopeSvg = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.7"></rect>
        <path d="m5 7 7 5.5L19 7"></path>
        <path d="M5 17l5-4m9 4-5-4"></path>
      </svg>`;

    for (let i = 0; i < count; i += 1) {
      const tile = document.createElement("button");
      tile.className = "glass-square";
      tile.type = "button";
      tile.setAttribute("aria-label", "Mở lá thư");
      tile.innerHTML = envelopeSvg;

      const size = smallScreen ? 44 + (i % 3) * 2 : 48 + (i % 3) * 3;
      const lane = ((i + 0.5) / count) * 100;
      // Hoán vị thứ tự pha để ô không tạo thành một đường chéo trên màn hình.
      const phaseIndex = (i * (smallScreen ? 3 : 5)) % count;
      const phaseDelay = -((phaseIndex / count) * duration);
      tile.style.setProperty("--tile-size", `${size}px`);
      tile.style.setProperty("--tile-left", `${lane.toFixed(3)}%`);
      tile.style.setProperty("--tile-duration", `${duration}s`);
      tile.style.setProperty("--tile-delay", `${phaseDelay.toFixed(3)}s`);
      tile.style.setProperty("--tile-opacity", smallScreen ? "0.70" : "0.66");
      tile.addEventListener("click", onOpen);
      fragment.appendChild(tile);
    }

    layer.replaceChildren(fragment);
    document.addEventListener("visibilitychange", () => {
      layer.classList.toggle("is-paused", document.hidden);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
