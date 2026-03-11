(() => {
  const $ = (sel) => document.querySelector(sel);

  const params = new URLSearchParams(location.search);
  const personName = params.get("name") || "Birthday Legend";
  const dobParam = params.get("dob") || "2001-03-11";

  $("#name").textContent = personName;
  $("#dobLine").textContent = dobParam;

  // Coffin timer: countdown to next local midnight
  const countdownEl = $("#countdown");
  const dateLineEl = $("#dateLine");
  const ageSecondsEl = $("#ageSeconds");

  function parseDob(dobStr) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobStr);
    if (!m) return new Date(2001, 2, 11, 0, 0, 0, 0);
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d, 0, 0, 0, 0);
    if (Number.isNaN(dt.getTime())) return new Date(2001, 2, 11, 0, 0, 0, 0);
    return dt;
  }

  const dob = parseDob(dobParam);

  function fmt2(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);

    const diffMs = end.getTime() - now.getTime();
    const clamped = Math.max(0, diffMs);

    const totalSeconds = Math.floor(clamped / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownEl.textContent = `${fmt2(hours)}:${fmt2(minutes)}:${fmt2(seconds)}`;

    const long = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    dateLineEl.textContent = `${long} (local time)`;

    const ageSec = Math.max(0, Math.floor((now.getTime() - dob.getTime()) / 1000));
    ageSecondsEl.textContent = ageSec.toLocaleString(undefined);
  }

  setInterval(updateCountdown, 250);
  updateCountdown();

  // Confetti (tiny canvas particle system)
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d", { alpha: true });
  let confetti = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  const COLORS = ["#ff4fd8", "#a7ff3c", "#57d7ff", "#ffd166", "#f7f2e8"];

  function resize() {
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function blastConfetti(amount) {
    const originX = window.innerWidth * (0.25 + Math.random() * 0.5);
    const originY = window.innerHeight * (0.18 + Math.random() * 0.25);
    for (let i = 0; i < amount; i++) {
      confetti.push({
        x: originX,
        y: originY,
        vx: rand(-3.4, 3.4),
        vy: rand(-8.4, -3.2),
        g: rand(0.12, 0.22),
        w: rand(6, 12),
        h: rand(6, 14),
        r: rand(0, Math.PI),
        vr: rand(-0.18, 0.18),
        life: rand(62, 140),
        color: COLORS[(Math.random() * COLORS.length) | 0],
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti = confetti.filter((p) => p.life > 0);

    for (const p of confetti) {
      p.life -= 1;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 90));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }
  tick();

  // Coffin open/close
  const coffinBtn = $("#coffin");
  coffinBtn.addEventListener("click", () => {
    coffinBtn.classList.toggle("open");
    blastConfetti(22);
  });

  // Scatter zone cards (movies / games / things from 2001)
  const scatterZone = $("#scatterZone");

  const ITEMS = [
    // Movies (2001)
    {
      type: "movie",
      year: 2001,
      name: "The Lord of the Rings: The Fellowship of the Ring",
      tag: "A fellowship forms. Your back pain begins.",
    },
    {
      type: "movie",
      year: 2001,
      name: "Harry Potter and the Sorcerer's Stone",
      tag: "A wizard is born. So were you (basically).",
    },
    { type: "movie", year: 2001, name: "Shrek", tag: "Green icon. Peak early-2000s chaos." },
    {
      type: "movie",
      year: 2001,
      name: "Spirited Away",
      tag: "Beautiful, weird, unforgettable. Like turning 25.",
    },
    {
      type: "movie",
      year: 2001,
      name: "Monsters, Inc.",
      tag: "Screams were harvested. Now it's just responsibilities.",
    },
    {
      type: "movie",
      year: 2001,
      name: "A Beautiful Mind",
      tag: "Genius energy. Slightly unhinged confidence.",
    },

    // Games (2001)
    {
      type: "game",
      year: 2001,
      name: "Halo: Combat Evolved",
      tag: "Finish the fight (with adulthood).",
    },
    {
      type: "game",
      year: 2001,
      name: "Grand Theft Auto III",
      tag: "Open world unlocked. Consequences also unlocked.",
    },
    {
      type: "game",
      year: 2001,
      name: "Super Smash Bros. Melee",
      tag: "Still competitive. Still friendship-ending.",
    },
    {
      type: "game",
      year: 2001,
      name: "Max Payne",
      tag: "Noir vibes. Dramatic monologues. Perfect for a toast.",
    },
    {
      type: "game",
      year: 2001,
      name: "Final Fantasy X",
      tag: "Summon power. Cry a little. Continue.",
    },
    {
      type: "game",
      year: 2001,
      name: "Silent Hill 2",
      tag: "Existential dread, now in HD.",
    },

    // Things (2001)
    { type: "thing", year: 2001, name: "Wikipedia", tag: "Born in 2001. Still correcting people." },
    { type: "thing", year: 2001, name: "iPod (1st gen)", tag: "A thousand songs. One perfect birthday bop." },
    { type: "thing", year: 2001, name: "Xbox (original)", tag: "Chunky, loud, legendary. Like this era." },
    { type: "thing", year: 2001, name: "GameCube", tag: "The handle says: portable chaos." },
    { type: "thing", year: 2001, name: "Mac OS X 10.0 (Cheetah)", tag: "A new era begins. That's you, today." },
    { type: "thing", year: 2001, name: "A very early internet", tag: "The web was loading... just like you." },
  ];

  function pick() {
    return ITEMS[Math.floor(Math.random() * ITEMS.length)];
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function makeCard(item) {
    const el = document.createElement("div");
    el.className = `card ${item.type}`;
    el.style.setProperty("--rot", `${rand(-10, 10).toFixed(1)}deg`);

    const chipLabel = item.type === "movie" ? "Movie" : item.type === "game" ? "Game" : "Thing";

    el.innerHTML = `
      <div class="meta">
        <span class="chip">${chipLabel}</span>
        <span>${item.year}</span>
      </div>
      <div class="name">${escapeHtml(item.name)}</div>
      <div class="tag">${escapeHtml(item.tag)}</div>
    `;

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      el.classList.toggle("pinned");
      if (el.classList.contains("pinned")) blastConfetti(10);
    });

    el.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      el.remove();
    });

    // Simple drag inside the zone
    let dragging = false;

    el.addEventListener("pointerdown", (e) => {
      if (el.classList.contains("pinned")) return;
      dragging = true;
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const rect = scatterZone.getBoundingClientRect();
      const px = clamp(e.clientX - rect.left, 0, rect.width);
      const py = clamp(e.clientY - rect.top, 0, rect.height);
      el.style.left = `${(px / rect.width) * 100}%`;
      el.style.top = `${(py / rect.height) * 100}%`;
    });

    el.addEventListener("pointerup", () => {
      dragging = false;
    });
    el.addEventListener("pointercancel", () => {
      dragging = false;
    });

    return el;
  }

  function scatterOne() {
    const item = pick();
    const card = makeCard(item);
    card.style.left = `${rand(12, 88)}%`;
    card.style.top = `${rand(14, 82)}%`;
    scatterZone.appendChild(card);
  }

  function scatterMany(n) {
    for (let i = 0; i < n; i++) scatterOne();
    blastConfetti(Math.min(40, 8 + n * 2));
  }

  $("#scatterBtn").addEventListener("click", () => scatterMany(6));
  $("#clearBtn").addEventListener("click", () => {
    [...scatterZone.querySelectorAll(".card")].forEach((n) => n.remove());
  });

  scatterMany(10);

  // Toast generator
  const TOAST_BITS = {
    openers: [
      "Hear ye, hear ye:",
      "Tonight we gather to witness:",
      "In the ancient year 2001, destiny declared:",
      "By the power vested in cake:",
      "On this sacred patch day:",
    ],
    middles: [
      "may your quests always have checkpoints",
      "may your Wi-Fi be strong and your snacks stronger",
      "may your inventory be full of good people",
      "may your HP regenerate faster than your responsibilities",
      "may your side quests pay rent",
    ],
    closers: [
      "and may 25 treat you gently (or at least hilariously).",
      "and may your next cutscene be unskippably awesome.",
      "and may you never step on LEGO again.",
      "and may the soundtrack never stop.",
      "and may the coffin timer fear you.",
    ],
  };

  function pickFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function makeToastLine() {
    return `${pickFrom(TOAST_BITS.openers)} ${personName}, ${pickFrom(TOAST_BITS.middles)} ${pickFrom(
      TOAST_BITS.closers,
    )}`;
  }

  const toastEl = $("#toast");
  $("#toastBtn").addEventListener("click", () => {
    toastEl.textContent = makeToastLine();
    blastConfetti(18);
  });

  $("#copyToastBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(toastEl.textContent);
      toastEl.textContent = `${toastEl.textContent} (copied)`;
    } catch {
      toastEl.textContent = `${toastEl.textContent} (copy failed)`;
    }
  });

  // Birthday music (WebAudio, click-to-start)
  let audio = null;

  function createMusic(context) {
    const master = context.createGain();
    master.gain.value = 0.18;
    master.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.7;
    filter.connect(master);

    const bpm = 122;
    const beat = 60 / bpm;

    const scale = [0, 2, 4, 7, 9, 12];
    const root = 220;

    function noteFreq(semitones) {
      return root * Math.pow(2, semitones / 12);
    }

    function pluck(t, freq, dur, panVal) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const pan = context.createStereoPanner();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.9, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      pan.pan.setValueAtTime(panVal, t);

      osc.connect(gain);
      gain.connect(pan);
      pan.connect(filter);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    }

    function kick(t) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(46, t + 0.12);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(1.0, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    function hat(t) {
      const bufferSize = 2 * context.sampleRate;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = context.createBufferSource();
      noise.buffer = buffer;

      const hp = context.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 6000;

      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      noise.connect(hp);
      hp.connect(gain);
      gain.connect(master);

      noise.start(t);
      noise.stop(t + 0.04);
    }

    function scheduleBar(startTime) {
      for (let step = 0; step < 16; step++) {
        const t = startTime + step * (beat / 4);
        if (step % 4 === 0) kick(t);
        if (step % 2 === 1) hat(t);

        const degree = scale[(step * 2 + (step % 3)) % scale.length];
        const oct = step % 8 < 4 ? 12 : 24;
        const f = noteFreq(degree + oct);
        pluck(t, f, beat / 3.2, step % 2 ? 0.35 : -0.35);
      }
    }

    let nextBarTime = context.currentTime + 0.05;

    const interval = setInterval(() => {
      const t = context.currentTime;
      while (nextBarTime < t + beat * 8) {
        scheduleBar(nextBarTime);
        nextBarTime += beat * 4;
      }
    }, 120);

    return {
      stop() {
        clearInterval(interval);
        master.gain.setTargetAtTime(0.0001, context.currentTime, 0.05);
      },
    };
  }

  const musicBtn = $("#musicBtn");
  function setMusicLabel(isOn) {
    musicBtn.textContent = isOn ? "Stop birthday bop" : "Start birthday bop";
  }

  musicBtn.addEventListener("click", async () => {
    if (audio) {
      audio.stop();
      audio = null;
      setMusicLabel(false);
      return;
    }

    const ctxA = new (window.AudioContext || window.webkitAudioContext)();
    try {
      await ctxA.resume();
    } catch {
      // ignore
    }

    audio = createMusic(ctxA);
    setMusicLabel(true);
    blastConfetti(36);
  });

  setTimeout(() => blastConfetti(28), 450);
})();
