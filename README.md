# 1021

Open `index.html` to start the birthday surprise. After the nickname prompt, the experience is split into these pages:

- `birthday.html` — the birthday greeting and link to the memory wall.
- `memory-wall.html` — a wall of 12 flip-to-read illustrated memories and a link to the trivia quest.
- `trivia.html` — a five-question quiz; all answers must be correct to reveal the vault button.
- `digital-vault.html` — the birthday letter, interactive digital vault letters, and a link to the cake.
- `cake.html` — make a wish, light and blow out four candles, then tap the cake to serve a slice.

The birthday, memory-wall, and cake pages use separate stylesheets; the cake experience has its own `cake.css` and `cake.js`.

## Birthday song player

The player stays in the top-right corner while moving between birthday pages. It starts as a small spinning vinyl button; tap it to open the compact controls and use the back arrow to collapse it without stopping the song. The vinyl uses a pink design by default or your configured cover image. Start playback with the play button; browsers require a user action before they allow audio to play. Internal page links use in-page navigation so the same audio element keeps playing without restarting. Open the site through an HTTP/HTTPS server (for example, GitHub Pages or VS Code Live Server), not by opening the HTML files directly; browsers block the requests needed for in-page navigation from `file://`.

To add a song and her photo, put the audio and image files in a `media` folder and edit `music-config.js`. Set `coverSrc` to her photo (for example, `media/her-photo.jpg`); the photo is cropped to the spinning record. For example:

```js
window.BIRTHDAY_MUSIC = {
  title: "Our Song",
  artist: "For you",
  audioSrc: "media/our-song.mp3",
  coverSrc: "media/our-photo.jpg",
  lyrics: [
    { time: 0, text: "First lyric line" },
    { time: 12, text: "Next lyric line" }
  ]
};
```

Lyrics are displayed beside the cover and the current line is highlighted using the timestamps in seconds. Add the lyrics and timing yourself; automatic song transcription needs a speech-to-text service, which this static site does not use. There are no public upload controls. The config and any media files added to the repository are still visible to anyone who can access a publicly deployed site.
