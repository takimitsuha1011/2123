const memories = [
  {
    caption: "First Date ☕",
    note: "I was so nervous before you walked in, and then we talked for hours until the cafe closed. Best coffee ever. ☕❤️",
    art: "☕",
    image: "images/1.jpg"
  },
  {
    caption: "Road Trip 🚗",
    note: "Singing at the top of our lungs with the windows down and pulling over to look at the stars. 🌠🚗",
    art: "🚗",
    image: "images/2.jpg"
  },
  {
    caption: "Stargazing ✨",
    note: "Wrapped up in one giant blanket under the night sky. None of those stars shine as bright as you. ✨🌙",
    art: "🌙",
    image: "images/199.jpg"
  },
  {
    caption: "Our Laugh Fest 😂",
    note: "I don't even remember what started the joke, just that we laughed until our stomachs hurt. 😂💕",
    art: "😂",
    image: "images/4.jpg"
  },
  {
    caption: "Coffee Dates ☕",
    note: "Every little coffee date turns into my favorite part of the day when I'm with you. ☕💖",
    art: "🥐",
    image: "images/5.jpg"
  },
  {
    caption: "Singing Together 🎤",
    note: "Our car concerts may be off-key, but they will always be number one on my playlist. 🎶",
    art: "🎤",
    image: "images/6.jpg"
  },
  {
    caption: "Cozy Sundays 🧸",
    note: "Slow mornings, a cozy blanket, and nowhere else I'd rather be than right beside you. 🧸",
    art: "🧸",
    image: "images/7.jpg"
  },
  {
    caption: "A Perfect Picnic 🧺",
    note: "Good food, fresh air, and your smile made an ordinary afternoon feel magical. 🌷",
    art: "🧺",
    image: "images/8.jpg"
  },
  {
    caption: "Little Adventures 🗺️",
    note: "Even when we don't know where we're going, every adventure is better with you. 🗺️",
    art: "🗺️",
    image: "images/9.jpg"
  },
  {
    caption: "Dancing Together 💃",
    note: "One song, a little dancing, and a memory I want to keep forever. 💃🕺",
    art: "💃",
    image: "images/10.jpg"
  },
  {
    caption: "Our Sweet Treat 🍰",
    note: "Sharing dessert with you is sweet, but getting to share life with you is even sweeter. 🍰",
    art: "🍰",
    image: "images/11.jpg"
  },
  {
    caption: "My Favorite Person 💖",
    note: "Of all the moments we've shared, my favorite is simply getting to be with you. Happy Birthday! 💖",
    art: "💖",
    image: "images/12.jpg"
  }
];

const palette = ["#FDE8B2", "#F9D5D3", "#DFD3E8", "#D4E4D2"];
const grid = document.getElementById("polaroid-grid");

memories.forEach((memory, index) => {
  const scene = document.createElement("button");
  scene.type = "button";
  scene.className = `polaroid-scene aspect-[4/5] min-h-52 relative ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`;
  scene.setAttribute("aria-label", `${memory.caption} memory. Tap to read its note.`);
  scene.setAttribute("aria-pressed", "false");

  const card = document.createElement("span");
  card.className = "polaroid-card";

  const front = document.createElement("span");
  front.className = "polaroid-face";

  const tape = document.createElement("span");
  tape.className = "washi-tape";
  tape.setAttribute("aria-hidden", "true");

  const art = document.createElement("span");
  art.className = "memory-art";
  art.style.backgroundColor = palette[index % palette.length];
  art.setAttribute("aria-hidden", "true");
  if (memory.image) {
    const image = document.createElement("img");
    image.className = "memory-photo";
    image.src = memory.image;
    image.alt = "";
    art.append(image);
  } else {
    art.textContent = memory.art;
  }

  const caption = document.createElement("span");
  caption.className = "memory-caption";
  caption.textContent = memory.caption;
  front.append(tape, art, caption);

  const back = document.createElement("span");
  back.className = "polaroid-face polaroid-back";

  const note = document.createElement("span");
  note.className = "memory-note";
  note.textContent = memory.note;

  const hint = document.createElement("span");
  hint.className = "memory-hint";
  hint.textContent = "Tap to flip back ↩";
  back.append(note, hint);
  card.append(front, back);
  scene.append(card);

  scene.addEventListener("click", () => {
    const flipped = card.classList.toggle("is-flipped");
    scene.setAttribute("aria-pressed", String(flipped));
  });

  grid.append(scene);
});
