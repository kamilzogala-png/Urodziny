(() => {
  const $ = (sel) => document.querySelector(sel);

  const personName = "Tomasz";
  $("#name").textContent = personName;

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
    const originY = window.innerHeight * (0.16 + Math.random() * 0.28);
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

  // Coffin timer: odliczanie do lokalnej północy (pasek + HH:MM:SS)
  const barFillEl = $("#barFill");
  const countdownTextEl = $("#countdownText");

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(24, 0, 0, 0);

    const totalMs = end.getTime() - start.getTime();
    const leftMs = Math.max(0, end.getTime() - now.getTime());
    const doneMs = Math.max(0, now.getTime() - start.getTime());

    const progress = totalMs > 0 ? Math.min(1, doneMs / totalMs) : 0;
    barFillEl.style.width = `${progress * 100}%`;

    const totalSec = Math.floor(leftMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    countdownTextEl.textContent = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  }

  setInterval(updateCountdown, 250);
  updateCountdown();

  // 25 lat to...
  const equivalentsEl = $("#equivalents");

  const YEARS = 25;
  const seconds = YEARS * 365.2425 * 24 * 3600;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  function fmtInt(n) {
    return Math.round(n).toLocaleString("pl-PL");
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function addEq(title, num, sub) {
    const el = document.createElement("div");
    el.className = "eq";
    el.innerHTML = `
      <div class="eq-top">
        <div class="eq-title">${escapeHtml(title)}</div>
        <div class="eq-num mono">${escapeHtml(num)}</div>
      </div>
      <div class="eq-sub">${escapeHtml(sub)}</div>
    `;
    equivalentsEl.appendChild(el);
  }

  // Zabawne założenia
  const hemingwayBookHours = 6.5;
  const nirvanaSongMinutes = 3.5;
  const rdrPlaythroughHours = 55;
  const mkMatchMinutes = 3;
  const mkLossRate = 2 / 3;
  const gtaCadenceYears = 2.5;
  // Żeby mieściło się bez scrolla: dokładnie 8 kafelków.
  addEq(
    "Hemingway",
    `${fmtInt(hours / hemingwayBookHours)} książek`,
    `~${hemingwayBookHours} h na jedną.`,
  );

  addEq(
    "Nirvana",
    `${fmtInt(minutes / nirvanaSongMinutes)} utworów`,
    `~${nirvanaSongMinutes} min na utwór.`,
  );

  addEq(
    "Red Dead Redemption",
    `${fmtInt(hours / rdrPlaythroughHours)} przejść`,
    `~${rdrPlaythroughHours} h na fabułę.`,
  );

  const gtaGames = Math.floor(YEARS / gtaCadenceYears);
  addEq("GTA", `${gtaGames} premier`, `Co ~${gtaCadenceYears} roku.`);

  const mkMatches = minutes / mkMatchMinutes;
  const mkLosses = mkMatches * mkLossRate;
  addEq("Mortal Kombat", `${fmtInt(mkLosses)} porażek`, `2/3 przegranych z kamilem, ~${mkMatchMinutes} min.`);

  addEq(
    "Ambitnych czarnobiałych filmów",
    `${fmtInt(minutes / 192)} filmów`,
    "Średnio 3 h 12 min na film.",
  );

  addEq(
    "YouTube",
    `${fmtInt(minutes / 8)} filmików`,
    "Zakładając średnio 8 minut na film.",
  );

  addEq(
    "Podcasty",
    `${fmtInt(minutes / 60)} odcinków`,
    "Jeśli odcinek trwa godzinę.",
  );


// Naklejki na tle: premiery 2001
  const stickersRoot = $("#stickers");
  const modal = $("#modal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");
  const modalClose = $("#modalClose");

  function showModal(title, htmlBody) {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlBody;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function hideModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  modalClose.addEventListener("click", hideModal);
  modal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close === "true") hideModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
  });
  const RELEASES_2001 = [
    // Filmy (2001)
    { type: "film", title: "Shrek", date: "2001", desc: "Ogr, osioł i bajkowy chaos. Klasyk wczesnych 2000." },
    { type: "film", title: "Władca Pierścieni: Drużyna Pierścienia", date: "2001", desc: "Fellowship powstaje. Twoja nostalgia też." },
    { type: "film", title: "Harry Potter i Kamień Filozoficzny", date: "2001", desc: "Start magicznej ery. Rocznik 2001." },
    { type: "film", title: "Potwory i Spółka", date: "2001", desc: "Screamy były walutą. Teraz są nimi deadline'y." },
    { type: "film", title: "Spirited Away (W krainie bogów)", date: "2001", desc: "Arcydzieło anime. Piękne, dziwne, niezapomniane." },
    { type: "film", title: "Szybcy i wściekli", date: "2001", desc: "Nitro, rodzina i początki serii." },
    { type: "film", title: "Ocean's Eleven", date: "2001", desc: "Napad z klasą. Skład marzeń." },
    { type: "film", title: "A.I. Sztuczna inteligencja", date: "2001", desc: "Baśń SF o człowieczeństwie." },
    { type: "film", title: "Park Jurajski III", date: "2001", desc: "Dinozaury wracają. Nostalgia też." },
    { type: "film", title: "The Others", date: "2001", desc: "Mroczny klimat i twist." },
    { type: "film", title: "Training Day", date: "2001", desc: "Jeden dzień. Dużo chaosu." },
    { type: "film", title: "Zoolander", date: "2001", desc: "Moda, absurd, cytaty." },
    { type: "film", title: "Donnie Darko", date: "2001", desc: "Królik, pętla czasu i niepokój." },
    { type: "film", title: "Helikopter w ogniu (Black Hawk Down)", date: "2001", desc: "Wojna, adrenalina, realizm." },
    { type: "film", title: "Moulin Rouge!", date: "2001", desc: "Muzyczny przepych i dramat." },
    { type: "film", title: "Legalna blondynka", date: "2001", desc: "Róż, prawo i świetna energia." },
    { type: "film", title: "Piękny umysł", date: "2001", desc: "Geniusz, paranoja, serce." },
    { type: "film", title: "Pamiętnik księżniczki", date: "2001", desc: "Metamorfoza level: 25." },
    { type: "film", title: "Godziny szczytu 2", date: "2001", desc: "Akcja + komedia + duo." },
    { type: "film", title: "Planeta Małp", date: "2001", desc: "Remake z dużą dawką klimatu." },
    { type: "film", title: "Vanilla Sky", date: "2001", desc: "Sen, jawа, pytania." },
    { type: "film", title: "Pearl Harbor", date: "2001", desc: "Rozmach i melodramat." },
    { type: "film", title: "Powrót Mumii", date: "2001", desc: "Przygoda i starożytne zło." },
    { type: "film", title: "Dzieciaki z klasy 1A (Spy Kids)", date: "2001", desc: "Szpiedzy, gadżety, fun." },
    { type: "film", title: "Lara Croft: Tomb Raider", date: "2001", desc: "Ikona gier w wersji kinowej." },
    { type: "film", title: "Monster's Ball", date: "2001", desc: "Ciężki dramat, mocne role." },
    { type: "film", title: "Nie kolejna komedia teen", date: "2001", desc: "Parodia, którą cytujesz." },
    { type: "film", title: "Genialny klan (The Royal Tenenbaums)", date: "2001", desc: "Wes Anderson vibe." },
    { type: "film", title: "Swordfish", date: "2001", desc: "Hakerka i akcja." },
    { type: "film", title: "Straszny film 2", date: "2001", desc: "Parodia horrorów." },
    { type: "film", title: "The Score", date: "2001", desc: "Napad, napięcie, duet." },
    { type: "film", title: "Wróg u bram", date: "2001", desc: "Snajperzy i zimny Stalingrad." },
    { type: "film", title: "Za linią wroga", date: "2001", desc: "Ucieczka i adrenalina." },
    { type: "film", title: "Ghost World", date: "2001", desc: "Ironia i dorastanie." },
    { type: "film", title: "Jay i Cichy Bob kontratakują", date: "2001", desc: "Komedia dla wtajemniczonych." },
    { type: "film", title: "Shallow Hal", date: "2001", desc: "Komedia z morałem." },
    { type: "film", title: "Bridget Jones: W pogoni za rozumem (Dziennik)", date: "2001", desc: "Rom-com era." },
    { type: "film", title: "Amelia", date: "2001", desc: "Paryż, urok, drobne cuda." },
    { type: "film", title: "The Wedding Planner", date: "2001", desc: "Miłość i chaos planowania." },

    // Gry (2001)
    { type: "gra", title: "Halo: Combat Evolved", date: "2001", desc: "Master Chief wchodzi na scenę. Ikona." },
    { type: "gra", title: "Grand Theft Auto III", date: "2001", desc: "Miasto otwarte. Konsekwencje też." },
    { type: "gra", title: "Max Payne", date: "2001", desc: "Noir, monologi, bullet time." },
    { type: "gra", title: "Metal Gear Solid 2: Sons of Liberty", date: "2001", desc: "Stealth, kino, mind-blown." },
    { type: "gra", title: "Silent Hill 2", date: "2001", desc: "Psychologiczny horror, legenda." },
    { type: "gra", title: "Final Fantasy X", date: "2001", desc: "JRPG epoki. Łzy gwarantowane." },
    { type: "gra", title: "Devil May Cry", date: "2001", desc: "Styl, demony, combo." },
    { type: "gra", title: "Gran Turismo 3: A-Spec", date: "2001", desc: "Wyścigi w jakości: wow." },
    { type: "gra", title: "Tony Hawk's Pro Skater 3", date: "2001", desc: "Soundtrack i tricki na wieczność." },
    { type: "gra", title: "Ico", date: "2001", desc: "Minimalizm i magia." },
    { type: "gra", title: "Super Smash Bros. Melee", date: "2001", desc: "Wieczna rywalizacja." },
    { type: "gra", title: "Advance Wars", date: "2001", desc: "Taktyka w kieszeni." },
    { type: "gra", title: "Golden Sun", date: "2001", desc: "Klasyczny JRPG na GBA." },
    { type: "gra", title: "Ace Combat 04", date: "2001", desc: "Podniebny balet." },
    { type: "gra", title: "Civilization III", date: "2001", desc: "Jeszcze jedna tura..." },
    { type: "gra", title: "Jak and Daxter: The Precursor Legacy", date: "2001", desc: "Platformówka PS2 era." },
    { type: "gra", title: "Luigi's Mansion", date: "2001", desc: "Strach na wesoło." },
    { type: "gra", title: "Animal Crossing", date: "2001", desc: "Spokojne życie w wiosce." },
    { type: "gra", title: "SSX Tricky", date: "2001", desc: "Snowboard i styl." },
    { type: "gra", title: "Burnout", date: "2001", desc: "Prędkość i kraksy." },
    { type: "gra", title: "Red Faction", date: "2001", desc: "Geomod i rewolucja." },
    { type: "gra", title: "Twisted Metal: Black", date: "2001", desc: "Areny i wybuchy." },
    { type: "gra", title: "Baldur's Gate: Dark Alliance", date: "2001", desc: "Dungeon crawl w co-op." },
    { type: "gra", title: "Gothic", date: "2001", desc: "Kultowy klimat RPG." },
    { type: "gra", title: "Operation Flashpoint: Cold War Crisis", date: "2001", desc: "Mil-sim legenda." },
    { type: "gra", title: "Dark Age of Camelot", date: "2001", desc: "MMO epoki." },
    { type: "gra", title: "Pro Evolution Soccer", date: "2001", desc: "Piłka nożna w najlepszym stylu." },
    { type: "gra", title: "FIFA Football 2002", date: "2001", desc: "Kolejny sezon." },
    { type: "gra", title: "Sonic Adventure 2", date: "2001", desc: "Szybkość i chaos." },
    { type: "gra", title: "Conker's Bad Fur Day", date: "2001", desc: "Niegrzeczna platformówka." },
    { type: "gra", title: "Return to Castle Wolfenstein", date: "2001", desc: "Strzelanka klasyczna." },
    { type: "gra", title: "Pikmin", date: "2001", desc: "Małe stworki, wielkie strategie." },
    { type: "gra", title: "Onimusha: Warlords", date: "2001", desc: "Samuraje i demony." },
    { type: "gra", title: "RuneScape", date: "2001", desc: "MMO, które urosło." },
    { type: "gra", title: "Klonoa 2", date: "2001", desc: "Urocza platformówka." },
    { type: "gra", title: "Dynasty Warriors 3", date: "2001", desc: "Tysiące przeciwników." },
    { type: "gra", title: "Metal Slug 4", date: "2001", desc: "Arcade run'n'gun." },
    { type: "gra", title: "Capcom vs. SNK 2", date: "2001", desc: "Bijatyka marzeń." },
    { type: "gra", title: "Worms World Party", date: "2001", desc: "Robaki i chaos." },
    { type: "gra", title: "Black & White", date: "2001", desc: "Bóg, bestia, wybory." },
    { type: "gra", title: "Gitaroo Man", date: "2001", desc: "Rytm i styl." },
    { type: "gra", title: "Silent Bomber", date: "2001", desc: "Wybuchowa akcja." },

    // Rzeczy (2001)
    { type: "rzecz", title: "Wikipedia", date: "2001", desc: "Największa encyklopedia świata. Rocznik 2001." },
    { type: "rzecz", title: "BitTorrent", date: "2001", desc: "P2P, które zmieniło internet." },
    { type: "rzecz", title: "Creative Commons", date: "2001", desc: "Licencje, które ułatwiły dzielenie się." },
    { type: "rzecz", title: "iPod (1. generacja)", date: "2001", desc: "Tysiąc piosenek w kieszeni." },
    { type: "rzecz", title: "Xbox (pierwszy)", date: "2001", desc: "Wejście Microsoftu do konsol." },
    { type: "rzecz", title: "GameCube", date: "2001", desc: "Sześcian z rączką. Nintendo vibe." },
    { type: "rzecz", title: "Game Boy Advance", date: "2001", desc: "Konsola przenośna nowej generacji." },
    { type: "rzecz", title: "Windows XP", date: "2001", desc: "System, który został na lata." },
    { type: "rzecz", title: "iTunes", date: "2001", desc: "Apple porządkuje muzykę w bibliotece." },
    { type: "rzecz", title: "Mac OS X 10.0 (Cheetah)", date: "2001", desc: "Początek nowoczesnego macOS." },
    { type: "rzecz", title: "Mac OS X 10.1 (Puma)", date: "2001", desc: "Dojrzalszy Mac OS X." },
    { type: "rzecz", title: "Flash Player 6", date: "2001", desc: "Web w erze flashowej magii." },
    // Dodatkowe (żeby dobić do ~100)
    { type: "film", title: "Mulholland Drive", date: "2001", desc: "Sen, koszmar i zagadka Hollywood." },
    { type: "film", title: "The Royal Tenenbaums", date: "2001", desc: "Rodzinny dramat w stylu Wes Anderson." },
    { type: "film", title: "A Knight's Tale", date: "2001", desc: "Rycerze, rock i dobra zabawa." },

    { type: "gra", title: "Diablo II: Lord of Destruction", date: "2001", desc: "Dodatek, który zjadł setki godzin." },
    { type: "gra", title: "Red Alert 2: Yuri's Revenge", date: "2001", desc: "Strategia i totalny absurd." },
    { type: "gra", title: "Phantasy Star Online", date: "2001", desc: "Kooperacja i grind epoki." },

    { type: "rzecz", title: "Nokia 7650", date: "2001", desc: "Telefon, który wyglądał jak przyszłość." },
  ];

  function toneForType(type) {
    if (type === "film") return "hot";
    if (type === "gra") return "lime";
    return "ice";
  }

  function iconForType(type) {
    if (type === "film") return "🎬";
    if (type === "gra") return "🎮";
    return "🧩";
  }

  function clearStickers() {
    stickersRoot.innerHTML = "";
  }

  function intersects(a, b) {
    return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  }

  function expandRect(r, pad) {
    return { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad };
  }

  function getExclusions() {
    const nodes = [
      document.querySelector(".top"),
      document.querySelector(".coffin-panel"),
      document.querySelector(".museum"),
      document.querySelector(".footer"),
    ].filter(Boolean);

    return nodes.map((n) => expandRect(n.getBoundingClientRect(), 12));
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function placeSticker(item, exclusions, placedRects) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `sticker ${toneForType(item.type)}`;
    el.style.setProperty("--rot", `${rand(-8, 8).toFixed(1)}deg`);

    const title = `${iconForType(item.type)} ${item.title}`;
    const sub = `${item.type.toUpperCase()} • ${item.date}`;

    el.innerHTML = `
      <div class="sticker-top">
        <div class="sticker-title">${escapeHtml(title)}</div>
        <div class="sticker-dot">•</div>
      </div>
      <div class="sticker-sub">${escapeHtml(sub)}</div>
    `;

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      blastConfetti(10);
      const body = `
        <div class="modal-meta">Premiera: <span class="mono">${escapeHtml(item.date)}</span></div>
        <div class="modal-desc">${escapeHtml(item.desc)}</div>
      `;
      showModal(item.title, body);
    });

    // Measure sticker.
    el.style.visibility = "hidden";
    stickersRoot.appendChild(el);

    const w = Math.max(1, el.offsetWidth);
    const h = Math.max(1, el.offsetHeight);

    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight);

    const margin = 10;
    const gap = 12;
    const tries = 220;

    function rectFromCenter(cx, cy) {
      return {
        left: cx - w / 2,
        right: cx + w / 2,
        top: cy - h / 2,
        bottom: cy + h / 2,
      };
    }

    let chosen = null;

    for (let i = 0; i < tries; i++) {
      const cx = rand(margin + w / 2, vw - margin - w / 2);
      const cy = rand(margin + h / 2, vh - margin - h / 2);

      const rect = expandRect(rectFromCenter(cx, cy), gap);

      const hitPanels = exclusions.some((ex) => intersects(rect, ex));
      if (hitPanels) continue;

      const hitStickers = placedRects.some((pr) => intersects(rect, pr));
      if (hitStickers) continue;

      chosen = { cx, cy, rect };
      break;
    }

    if (!chosen) {
      el.remove();
      return null;
    }

    el.style.left = `${(chosen.cx / vw) * 100}%`;
    el.style.top = `${(chosen.cy / vh) * 100}%`;
    el.style.visibility = "visible";

    // Return the padded rect we used for collision checks.
    return chosen.rect;
  }

  function estimateStickerCount(exclusions) {
    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight);
    const viewportArea = vw * vh;

    // Approximate excluded area by summing rectangles clipped to the viewport.
    let excluded = 0;
    for (const ex of exclusions) {
      const left = clamp(ex.left, 0, vw);
      const right = clamp(ex.right, 0, vw);
      const top = clamp(ex.top, 0, vh);
      const bottom = clamp(ex.bottom, 0, vh);
      const w = Math.max(0, right - left);
      const h = Math.max(0, bottom - top);
      excluded += w * h;
    }

    const available = Math.max(0, viewportArea - excluded);

    // Measure one representative sticker once.
    const probe = document.createElement("div");
    probe.className = "sticker hot";
    probe.style.visibility = "hidden";
    probe.style.left = "0";
    probe.style.top = "0";
    probe.innerHTML = '<div class="sticker-top"><div class="sticker-title">🎬 Władca Pierścieni: Drużyna Pierścienia</div><div class="sticker-dot">•</div></div><div class="sticker-sub">FILM • 2001-12-19</div>';
    stickersRoot.appendChild(probe);
    const sw = Math.max(1, probe.offsetWidth);
    const sh = Math.max(1, probe.offsetHeight);
    probe.remove();

    const stickerArea = sw * sh;

    // Packing factor: bigger = fewer stickers.
    const packing = 3.2;
    let count = Math.floor(available / (stickerArea * packing));

    // Hard caps for sanity.
    if (vw < 700 || vh < 720) count = Math.min(count, 10);
    count = clamp(count, 5, 18);

    return count;
  }

    function reshuffle() {
    clearStickers();

    const exclusions = getExclusions();
    const targetCount = estimateStickerCount(exclusions);

    const pool = [];
    for (let i = 0; i < 6; i++) pool.push(...RELEASES_2001);
    pool.sort(() => Math.random() - 0.5);

    const placedRects = [];
    let placed = 0;

    for (const item of pool) {
      if (placed >= targetCount) break;
      const rect = placeSticker(item, exclusions, placedRects);
      if (!rect) continue;
      placedRects.push(rect);
      placed++;
    }
  }

  $("#reshuffleBtn").addEventListener("click", () => {
    reshuffle();
    blastConfetti(18);
  });

  // Toast generator
  const toastEl = $("#toast");
  const TOAST_BITS = {
    openers: ["Uwaga, uwaga:", "Dziś zbieramy się, żeby uczcić:", "W legendarnym roku 2001 los postanowił:", "Mocą tortu i świeczek:", "W ten święty dzień:"],
    middles: [
      "niech Twoje questy zawsze mają checkpointy",
      "niech Wi‑Fi będzie mocne, a przekąski jeszcze mocniejsze",
      "niech ekwipunek będzie pełny dobrych ludzi",
      "niech HP regeneruje się szybciej niż obowiązki",
      "niech side questy płacą czynsz",
    ],
    closers: [
      "i niech 25 potraktuje Cię łagodnie (albo przynajmniej zabawnie).",
      "i niech kolejna cutscenka będzie nie do pominięcia.",
      "i niech już nigdy nie nadepniesz na klocek LEGO.",
      "i niech soundtrack nigdy się nie kończy.",
      "i niech trumna się Ciebie boi.",
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

  $("#toastBtn").addEventListener("click", () => {
    toastEl.textContent = makeToastLine();
    blastConfetti(18);
  });

  $("#copyToastBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(toastEl.textContent);
      toastEl.textContent = `${toastEl.textContent} (skopiowano)`;
    } catch {
      toastEl.textContent = `${toastEl.textContent} (nie udało się skopiować)`;
    }
  });

  // Muzyka: autoplay + fallback + zamykanie bramki
  const bgm = $("#bgm");
  const musicBtn = $("#musicBtn");
  const audioGate = $("#audioGate");
  const audioGateBtn = $("#audioGateBtn");
  const audioGateClose = $("#audioGateClose");

  function setMusicLabel() {
    const on = !bgm.paused;
    musicBtn.textContent = on ? "Muzyka: wyłącz" : "Muzyka: włącz";
  }

  async function tryPlay() {
    try {
      await bgm.play();
      audioGate.hidden = true;
      setMusicLabel();
      return true;
    } catch {
      audioGate.hidden = false;
      setMusicLabel();
      return false;
    }
  }

  function hideAudioGate() {
    audioGate.hidden = true;
  }

  musicBtn.addEventListener("click", async () => {
    if (bgm.paused) {
      const ok = await tryPlay();
      if (ok) blastConfetti(20);
    } else {
      bgm.pause();
      setMusicLabel();
    }
  });

  audioGateBtn.addEventListener("click", async () => {
    const ok = await tryPlay();
    if (ok) blastConfetti(26);
  });

  audioGateClose.addEventListener("click", (e) => {
    e.stopPropagation();
    hideAudioGate();
  });

  // Próba autoplay
  tryPlay();

  // Spokój button
  $("#clearConfettiBtn").addEventListener("click", () => {
    confetti = [];
    hideAudioGate();
  });

  // Start
  reshuffle();

  // Re-layout after fonts load and on resize (prevents "rozjechanie" when metrics change).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      reshuffle();
    });
  }

  let resizeT = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      reshuffle();
    }, 180);
  });
  setTimeout(() => blastConfetti(30), 450);
})();


















