/* anti-clickjacking: if another site frames this page, hide it and break out */
if (window.top !== window.self) {
  document.documentElement.style.display = "none";
  try { window.top.location.href = window.self.location.href; } catch (e) {}
}

/* ============ EDIT THESE LINES ============ */
const DOMAIN = "nyai.ai";
const INSTAGRAM = "vaishvivi_";   // without the @

/* Sponsored cards (the "parking" strip at the bottom).
   Paste affiliate / sponsor links here. Only https links are shown (max 3).
   Example: { name: "Fast hosting", text: "From $2/month", url: "https://your-affiliate-link" } */
const SPONSORS = [
];

/* Google AdSense. Leave empty until AdSense has approved the site.
   client: your publisher ID, e.g. "ca-pub-1234567890123456"
   top / mid / bottom: banner ad unit IDs, left / right: tall side-rail unit IDs (shown only on wide screens)
   e.g. "1234567890"   (leave a slot "" to skip it)
   auto: true  = also let Google's Auto ads decide extra placements (anchor and vignette ads),
                 which you switch on in the AdSense dashboard */
const ADS = { client: "", top: "", mid: "", bottom: "", left: "", right: "", auto: false };
/* ============================================== */

const IG = encodeURIComponent(INSTAGRAM.replace(/^@/, "").replace(/[^A-Za-z0-9._]/g, ""));
const IG_URL = "https://ig.me/m/" + IG;

/* the domain, in capitals, revealed letter by letter */
const shown = DOMAIN.toUpperCase();
const el = document.getElementById("domain");
document.title = shown + " is for sale";
el.setAttribute("aria-label", shown);
el.textContent = "";
[...shown].forEach((ch, i) => {
  const s = document.createElement("span");
  s.textContent = ch;
  s.style.setProperty("--i", i);
  s.setAttribute("aria-hidden", "true");
  el.appendChild(s);
});
/* once revealed, swap to plain text so the metallic sheen paints across the whole word */
setTimeout(() => { el.textContent = shown; }, 900 + shown.length * 70 + 1300);

document.querySelectorAll(".ig-link").forEach(a => a.href = IG_URL);
document.getElementById("handle").textContent = "@" + INSTAGRAM.replace(/^@/, "");
document.getElementById("f-handle").textContent = "@" + INSTAGRAM.replace(/^@/, "");
document.getElementById("f-brand").textContent = shown;
document.getElementById("f-name").textContent = shown;
document.getElementById("year").textContent = new Date().getFullYear();

/* domain link */
const domainLink = document.getElementById("domain-link");
if (domainLink) {
  domainLink.href = "https://" + DOMAIN;
}

/* sponsored strip: your own links, plus an open slot that DMs you */
const cards = document.getElementById("cards");
function addCard(name, text, url, slot) {
  const a = document.createElement("a");
  a.className = "card" + (slot ? " slot" : "");
  a.href = url;
  a.target = "_blank";
  a.rel = "sponsored noopener noreferrer";
  const b = document.createElement("b"); b.textContent = name;
  const s = document.createElement("span"); s.textContent = text;
  a.append(b, s);
  cards.appendChild(a);
}
SPONSORS.filter(x => x && /^https:\/\//.test(x.url)).slice(0, 3).forEach(x => addCard(x.name, x.text, x.url, false));
addCard("Your brand here", "Message the owner to advertise on " + DOMAIN, IG_URL, true);

/* round golden pointer */
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const root = document.documentElement;
  const mk = k => { const d = document.createElement("div"); d.className = "cur cur-" + k; d.appendChild(document.createElement("i")); document.body.appendChild(d); return d; };
  const dot = mk("dot"), ring = mk("ring");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let x = -100, y = -100, rx = x, ry = y, seen = false;
  const put = (el, a, b) => { el.style.transform = "translate3d(" + a + "px," + b + "px,0)"; };
  root.classList.add("has-cur");
  addEventListener("pointermove", e => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    if (!seen) { seen = true; rx = x; ry = y; dot.classList.add("show"); ring.classList.add("show"); }
    put(dot, x, y);
  }, { passive: true });
  (function loop() {
    rx = calm ? x : rx + (x - rx) * 0.18;
    ry = calm ? y : ry + (y - ry) * 0.18;
    put(ring, rx, ry);
    requestAnimationFrame(loop);
  })();
  const HOVER = "a,button,summary,[role=button]";
  const ADBOX = ".ad,ins.adsbygoogle,iframe,.google-auto-placed";
  document.addEventListener("pointerover", e => {
    const t = e.target.closest ? e.target : e.target.parentElement;
    root.classList.toggle("cur-hover", !!(t && t.closest(HOVER)));
    root.classList.toggle("cur-off", !!(t && t.closest(ADBOX)));
  });
  document.addEventListener("pointerdown", () => root.classList.add("cur-down"));
  addEventListener("pointerup", () => root.classList.remove("cur-down"));
  document.documentElement.addEventListener("pointerleave", () => { dot.classList.remove("show"); ring.classList.remove("show"); seen = false; });
})();

/* drifting gold dust */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.getElementById("dust"), x = c.getContext("2d");
  let w, h, dpr, ps = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
    ps = Array.from({ length: Math.round(innerWidth / 18) }, () => ({
      x: rnd(0, w), y: rnd(0, h), r: rnd(.6, 2.2) * dpr,
      vy: -rnd(.08, .35) * dpr, vx: rnd(-.08, .08) * dpr,
      a: rnd(.15, .6), t: rnd(0, 6.28)
    }));
  }
  function tick() {
    if (document.hidden) { requestAnimationFrame(tick); return; }
    x.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.t += .015;
      if (p.y < -10) { p.y = h + 10; p.x = rnd(0, w); }
      x.globalAlpha = p.a * (.6 + .4 * Math.sin(p.t));
      x.fillStyle = "#E9D9B4";
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", size);
  size(); tick();
})();

/* hide the long-press / right-click menu */
document.addEventListener("contextmenu", e => e.preventDefault());


/* AdSense: nothing loads or shows until ADS is filled in */
(() => {
  const okSlot = s => /^\d{6,15}$/.test(s);
  const SLOTS = [
    ["top", ADS.top, "horizontal"], ["mid", ADS.mid, "horizontal"], ["bottom", ADS.bottom, "horizontal"],
    ["left", ADS.left, "vertical"], ["right", ADS.right, "vertical"]
  ].filter(s => okSlot(s[1]) && (s[0] !== "left" && s[0] !== "right" || innerWidth >= 1360));
  if (!/^ca-pub-\d{8,20}$/.test(ADS.client) || !(SLOTS.length || ADS.auto === true)) return;
  const sc = document.createElement("script");
  sc.async = true; sc.crossOrigin = "anonymous";
  sc.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADS.client;
  document.head.appendChild(sc);
  SLOTS.forEach(([pos, slot, format]) => {
    const box = document.getElementById("ad-" + pos);
    const lab = document.createElement("small"); lab.textContent = "Advertisement";
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.dataset.adClient = ADS.client;
    ins.dataset.adSlot = slot;
    ins.dataset.adFormat = format;
    ins.dataset.fullWidthResponsive = format === "horizontal" ? "true" : "false";
    box.append(lab, ins);
    box.hidden = false;
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
  document.documentElement.classList.add("ads-on");
  /* privacy note is required once ads are on */
  const priv = document.getElementById("priv"), dlg = document.getElementById("privDlg");
  priv.hidden = false;
  priv.addEventListener("click", () => dlg.showModal());
  document.getElementById("privClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
})();