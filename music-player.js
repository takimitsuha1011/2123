(() => {
  const config = window.BIRTHDAY_MUSIC;
  if (!config) {
    throw new Error("music-config.js must load before music-player.js.");
  }

  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.setAttribute("aria-label", "Birthday song");

  const player = document.createElement("aside");
  player.className = "birthday-music-player is-collapsed";
  player.setAttribute("aria-label", "Birthday song player");

  const discButton = document.createElement("button");
  discButton.className = "birthday-music-disc";
  discButton.type = "button";
  discButton.setAttribute("aria-label", `Open player for ${config.title || "birthday song"}`);
  const discArt = document.createElement("span");
  discArt.className = "birthday-music-turntable";
  discArt.setAttribute("aria-hidden", "true");
  const record = document.createElement("span");
  record.className = "birthday-music-record";
  if (config.coverSrc) {
    const discImage = document.createElement("img");
    discImage.src = config.coverSrc;
    discImage.alt = "";
    discImage.addEventListener("error", () => discImage.remove(), { once: true });
    record.append(discImage);
  }
  const discCenter = document.createElement("span");
  discCenter.className = "birthday-music-disc-center";
  discCenter.setAttribute("aria-hidden", "true");
  record.append(discCenter);
  discArt.append(record);
  discButton.append(discArt);

  const expandedPlayer = document.createElement("div");
  expandedPlayer.className = "birthday-music-expanded";
  const topBar = document.createElement("div");
  topBar.className = "birthday-music-topbar";
  const back = makeButton("←", "Close player");
  back.classList.add("birthday-music-back");
  topBar.append(back);

  const main = document.createElement("div");
  main.className = "birthday-music-main";

  const cover = document.createElement("div");
  cover.className = "birthday-music-cover";
  cover.setAttribute("aria-hidden", "true");
  cover.textContent = "♫";

  if (config.coverSrc) {
    const image = document.createElement("img");
    image.src = config.coverSrc;
    image.alt = "";
    image.addEventListener("error", () => {
      image.remove();
      cover.textContent = "♫";
    }, { once: true });
    cover.replaceChildren(image);
  }

  const info = document.createElement("div");
  info.className = "birthday-music-info";
  const title = document.createElement("p");
  title.className = "birthday-music-title";
  title.textContent = config.title || "Birthday song";
  const artist = document.createElement("p");
  artist.className = "birthday-music-artist";
  artist.textContent = config.artist || "";
  const lyricsToggle = document.createElement("button");
  lyricsToggle.className = "birthday-music-lyrics-toggle";
  lyricsToggle.type = "button";
  lyricsToggle.textContent = "Lyrics";
  lyricsToggle.setAttribute("aria-expanded", "false");
  const lyrics = document.createElement("div");
  lyrics.className = "birthday-music-lyrics";
  lyrics.hidden = true;
  lyrics.setAttribute("aria-label", "Song lyrics");
  info.append(title, artist, lyricsToggle, lyrics);
  main.append(cover, info);

  const controls = document.createElement("div");
  controls.className = "birthday-music-controls";
  const previous = makeButton("⏮", "Restart song");
  const play = makeButton("▶", "Play song");
  play.classList.add("birthday-music-button-primary");
  const seek = document.createElement("input");
  seek.className = "birthday-music-seek";
  seek.type = "range";
  seek.min = "0";
  seek.max = "1000";
  seek.value = "0";
  seek.setAttribute("aria-label", "Song progress");
  const time = document.createElement("span");
  time.className = "birthday-music-time";
  time.textContent = "0:00 / 0:00";
  controls.append(previous, play, seek, time);

  const status = document.createElement("p");
  status.className = "birthday-music-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  expandedPlayer.append(topBar, main, controls, status);
  player.append(discButton, expandedPlayer);

  const wrapper = document.createElement("div");
  wrapper.id = "page-content";
  while (document.body.firstChild) wrapper.append(document.body.firstChild);
  document.body.append(wrapper, player, audio);

  const lyricsData = Array.isArray(config.lyrics)
    ? config.lyrics
      .filter((line) => line && Number.isFinite(Number(line.time)) && typeof line.text === "string")
      .map((line) => ({ time: Number(line.time), text: line.text }))
      .sort((first, second) => first.time - second.time)
    : [];

  if (lyricsData.length) {
    lyricsData.forEach((line) => {
      const element = document.createElement("p");
      element.className = "birthday-music-lyric";
      element.textContent = line.text;
      lyrics.append(element);
    });
  } else {
    const emptyLyrics = document.createElement("p");
    emptyLyrics.className = "birthday-music-lyric";
    emptyLyrics.textContent = "Add timestamped lyrics in music-config.js.";
    lyrics.append(emptyLyrics);
  }

  const hasSong = typeof config.audioSrc === "string" && config.audioSrc.trim().length > 0;
  if (hasSong) {
    audio.src = config.audioSrc;
  } else {
    status.textContent = "Add your song path in music-config.js to enable playback.";
  }
  [play, previous, seek].forEach((control) => {
    control.disabled = !hasSong;
  });

  discButton.addEventListener("click", () => {
    player.classList.remove("is-collapsed");
    player.classList.add("is-expanded");
    discButton.setAttribute("aria-expanded", "true");
    back.focus();
  });

  back.addEventListener("click", () => {
    player.classList.remove("is-expanded");
    player.classList.add("is-collapsed");
    discButton.setAttribute("aria-expanded", "false");
    discButton.focus();
  });

  play.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        status.textContent = "";
      } catch (error) {
        status.textContent = `Couldn't play the song: ${error.message}`;
      }
    } else {
      audio.pause();
    }
  });

  previous.addEventListener("click", () => {
    audio.currentTime = 0;
    if (audio.paused) {
      audio.play().catch((error) => {
        status.textContent = `Couldn't play the song: ${error.message}`;
      });
    }
  });

  audio.addEventListener("play", () => {
    player.classList.add("is-playing");
    play.textContent = "Ⅱ";
    play.setAttribute("aria-label", "Pause song");
  });
  audio.addEventListener("pause", () => {
    player.classList.remove("is-playing");
    play.textContent = "▶";
    play.setAttribute("aria-label", "Play song");
  });
  audio.addEventListener("error", () => {
    if (hasSong) status.textContent = "The song file couldn't be loaded. Check audioSrc in music-config.js.";
  });
  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    player.classList.remove("is-playing");
    play.textContent = "▶";
    play.setAttribute("aria-label", "Play song");
  });
  seek.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    }
  });

  lyricsToggle.addEventListener("click", () => {
    const isOpen = lyrics.hidden;
    lyrics.hidden = !isOpen;
    lyricsToggle.setAttribute("aria-expanded", String(isOpen));
  });

  function makeButton(text, label) {
    const button = document.createElement("button");
    button.className = "birthday-music-button";
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    return button;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  function updateProgress() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    seek.value = duration ? String(Math.round((current / duration) * 1000)) : "0";
    time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;

    let activeIndex = -1;
    lyricsData.forEach((line, index) => {
      if (line.time <= current) activeIndex = index;
    });
    lyrics.querySelectorAll(".birthday-music-lyric").forEach((line, index) => {
      line.classList.toggle("is-current", index === activeIndex);
    });
  }

  async function runPageScripts(parsedDocument, destination) {
    for (const script of parsedDocument.body.querySelectorAll("script")) {
      if (script.type && script.type !== "text/javascript" && script.type !== "application/javascript") continue;
      let source = script.textContent;
      if (script.src) {
        const scriptUrl = new URL(script.getAttribute("src"), destination);
        if (scriptUrl.origin !== window.location.origin) {
          throw new Error(`Refusing to execute a cross-origin page script: ${scriptUrl.href}`);
        }
        const response = await fetch(scriptUrl);
        if (!response.ok) throw new Error(`Could not load page script ${scriptUrl.pathname}.`);
        source = await response.text();
      }
      if (source.trim()) new Function(source)();
    }
  }

  function updateStylesheets(parsedDocument, destination) {
    const nextStylesheets = Array.from(parsedDocument.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => new URL(link.getAttribute("href"), destination))
      .filter((url) => url.origin === window.location.origin);
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const url = new URL(link.href);
      if (url.origin === window.location.origin) link.remove();
    });
    nextStylesheets.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url.href;
      document.head.append(link);
    });
  }

  async function navigate(destination, addHistory = true) {
    const target = new URL(destination, window.location.href);
    if (target.origin !== window.location.origin) {
      window.location.assign(target.href);
      return;
    }

    try {
      const response = await fetch(target.href, { headers: { "X-Requested-With": "fetch" } });
      if (!response.ok) throw new Error(`Page request failed with status ${response.status}.`);
      const parsedDocument = new DOMParser().parseFromString(await response.text(), "text/html");
      if (!parsedDocument.body || !parsedDocument.title) throw new Error("The requested page is incomplete.");

      window.dispatchEvent(new Event("birthday:pageleave"));
      document.body.className = parsedDocument.body.className;
      document.title = parsedDocument.title;
      updateStylesheets(parsedDocument, target);

      const pageNodes = Array.from(parsedDocument.body.childNodes).filter((node) => {
        return !(node.nodeType === Node.ELEMENT_NODE && node.tagName === "SCRIPT");
      });
      wrapper.replaceChildren(...pageNodes.map((node) => document.importNode(node, true)));
      if (addHistory) {
        window.history.pushState({}, "", target.href);
        window.scrollTo(0, 0);
      }
      await runPageScripts(parsedDocument, target);
    } catch (error) {
      status.textContent = `Page transition failed; opening the page normally. ${error.message}`;
      window.location.assign(target.href);
    }
  }

  window.navigateTo = navigate;
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || !target.pathname.endsWith(".html")) return;
    event.preventDefault();
    navigate(target.href);
  });

  window.addEventListener("popstate", () => {
    navigate(window.location.href, false);
  });
})();
