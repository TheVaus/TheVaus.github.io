/* Lays out the center-line timeline from ENTRIES (defined in timeline.html). */
(function () {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const root = document.getElementById("tlx");
  const list = document.getElementById("tlx-items");
  const svg = root.querySelector("svg");
  const NS = "http://www.w3.org/2000/svg";
  const TOP = 48, LANE0 = 30, LANE_GAP = 18, LABEL_GAP = 20, MIN_GAP = 14;

  const parse = (d, isEnd) => {
    if (d === "present") return parse(NOW);
    const [y, m] = d.split("-").map(Number);
    if (!m) return y + (isEnd ? 0.5 : 0);
    return y + (m - 1) / 12 + (isEnd ? 1 / 24 : 0);
  };
  const fmt = (d) => {
    const [y, m] = d.split("-");
    return m ? `${MONTHS[+m - 1]} ${y}` : y;
  };
  const nowLabel = () => { const [y, m] = NOW.split("-"); return `Present (${MONTHS_LONG[+m - 1]} ${y})`; };
  const START = 2003, F = Number(FOCUS);
  const yOf = (t) => t <= F ? TOP + PRE_PX * (t - START) / (F - START) : TOP + PRE_PX + (t - F) * PX_PER_YEAR;

  // Legend
  const legend = document.querySelector(".tlx-legend");
  const used = new Set(ENTRIES.map(e => e.kind));
  Object.entries(KINDS).forEach(([k, v]) => {
    if (!used.has(k)) return;
    const li = document.createElement("li");
    li.innerHTML = `<i style="background:${v.color}"></i>${v.label}`;
    legend.appendChild(li);
  });

  // Items (DOM order = chronological, for screen readers)
  const items = ENTRIES.map((e, i) => {
    const t0 = parse(e.start), t1 = e.end ? parse(e.end, true) : t0;
    const span = !!e.end;
    const sl = e.startLabel || fmt(e.start), el = e.endLabel || fmt(e.end || e.start);
    const range = span ? `${sl} – ${e.end === "present" ? "Present" : el}` : sl;
    const li = document.createElement("li");
    li.className = "tlx-item";
    li.style.setProperty("--c", KINDS[e.kind].color);
    li.innerHTML = `<p class="tlx-meta"><span class="tlx-kind">${KINDS[e.kind].label}</span><span class="tlx-date">${range}</span></p>` +
      `<h2 class="tlx-title">${e.href ? `<a href="${e.href}">${e.title}</a>` : e.title}</h2>` +
      (e.text ? `<p class="tlx-text">${e.text}</p>` : "");
    list.appendChild(li);
    let endEl = null;
    if (span && e.end !== "present") {
      endEl = document.createElement("span");
      endEl.className = "tlx-end";
      endEl.setAttribute("aria-hidden", "true");
      endEl.textContent = `${e.title}: ${e.endNote || "ended"} ${e.endLabel || fmt(e.end)}`;
      root.appendChild(endEl);
    }
    return { e, i, t0, t1, span, li, endEl };
  }).sort((a, b) => a.t0 - b.t0 || (b.t1 - b.t0) - (a.t1 - a.t0));

  const nowEl = document.createElement("span");
  nowEl.className = "tlx-now"; nowEl.textContent = nowLabel();
  root.appendChild(nowEl);
  const yearEls = [];
  for (let y = F; y <= Number(NOW.slice(0, 4)); y++) yearEls.push(y);
  yearEls.unshift(START);
  const yearNodes = yearEls.map(y => { const s = document.createElement("span"); s.className = "tlx-year"; s.setAttribute("aria-hidden", "true"); s.textContent = y; root.appendChild(s); return { y, s }; });

  function layout() {
    const W = root.clientWidth;
    const narrow = W < 760;
    root.classList.toggle("is-narrow", narrow);
    if (narrow) {
      // Phones: a simple chronological list on a left rail; no time scale or lanes.
      root.style.height = "";
      svg.innerHTML = "";
      [...list.children].forEach(el => { el.style.cssText = el.style.cssText.replace(/(left|top|width):[^;]+;?/g, ""); });
      return;
    }
    const cx = narrow ? 22 : Math.round(W / 2);
    // sides and lanes
    const lanes = { L: [], R: [] };
    let flip = false;
    items.forEach(it => {
      let side;
      if (narrow) side = "R";
      else if (it.e.side) side = it.e.side;
      else {
        const active = s => lanes[s].filter(end => end > it.t0).length;
        const a = active("L"), b = active("R");
        side = a === b ? (flip ? "L" : "R") : (a < b ? "L" : "R");
        flip = !flip;
      }
      it.side = side;
      it.lane = -1;
      if (it.span) {
        const arr = lanes[side];
        let k = arr.findIndex(end => end <= it.t0 - 0.05);
        if (k === -1) { k = arr.length; arr.push(0); }
        arr[k] = it.t1;
        it.lane = k;
      }
    });
    const nL = lanes.L.length, nR = lanes.R.length;
    const laneX = (side, k) => side === "R" ? cx + LANE0 + k * LANE_GAP : cx - LANE0 - k * LANE_GAP;
    const edge = { R: cx + LANE0 + Math.max(nR - 1, 0) * LANE_GAP + LABEL_GAP, L: cx - LANE0 - Math.max(nL - 1, 0) * LANE_GAP - LABEL_GAP };
    const width = { R: Math.min(380, W - edge.R - 8), L: Math.min(380, edge.L - 8) };

    // place labels with collision avoidance per side
    const placed = { L: [], R: [] };
    const place = (side, el, desired) => {
      let top = desired;
      const arr = placed[side];
      const h = el.offsetHeight;
      arr.sort((a, b) => a.top - b.top);
      for (const p of arr) if (top < p.top + p.h + MIN_GAP && top + h > p.top - MIN_GAP) top = p.top + p.h + MIN_GAP;
      arr.push({ top, h });
      return top;
    };
    items.forEach(it => {
      const el = it.li, side = it.side;
      el.style.width = width[side] + "px";
      el.style.left = (side === "R" ? edge.R : edge.L - width[side]) + "px";
      el.classList.toggle("is-left", side === "L");
    });
    const work = [];
    items.forEach(it => work.push({ it, el: it.li, y: yOf(it.t0), main: true }));
    items.forEach(it => { if (it.endEl) work.push({ it, el: it.endEl, y: yOf(it.t1), main: false }); });
    work.sort((a, b) => a.y - b.y);
    work.forEach(w => {
      const side = w.it.side;
      if (!w.main) {
        w.el.style.maxWidth = width[side] + "px";
        w.el.style.textAlign = side === "L" ? "right" : "left";
      }
      const h = w.el.offsetHeight;
      const desired = w.y - (w.main ? 12 : h / 2);
      const top = place(side, w.el, desired);
      w.el.style.top = top + "px";
      if (!w.main) w.el.style.left = (side === "R" ? edge.R : edge.L - w.el.offsetWidth) + "px";
      w.anchor = top + (w.main ? 12 : h / 2);
      if (w.main) w.it.anchor = w.anchor; else w.it.endAnchor = w.anchor;
    });

    const yNow = yOf(parse(NOW));
    nowEl.style.top = (yNow + 10) + "px";
    nowEl.style.left = (narrow ? cx - 8 : cx - nowEl.offsetWidth / 2) + "px";
    yearNodes.forEach(({ y, s }) => {
      s.style.top = (yOf(y) - s.offsetHeight / 2) + "px";
      s.style.left = (narrow ? 0 : cx - s.offsetWidth / 2) + "px";
      s.style.display = narrow ? "none" : "";
    });
    let maxBottom = yNow + 60;
    [...list.children].forEach(el => { maxBottom = Math.max(maxBottom, el.offsetTop + el.offsetHeight + 40); });
    root.style.height = maxBottom + "px";

    // draw
    svg.setAttribute("width", W); svg.setAttribute("height", maxBottom);
    svg.innerHTML = "";
    const line = (d, c, w, extra = {}) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", d); p.setAttribute("stroke", c); p.setAttribute("stroke-width", w); p.setAttribute("fill", "none"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); for (const k in extra) p.setAttribute(k, extra[k]); svg.appendChild(p); };
    const dot = (x, y, r, c, fill) => { const e = document.createElementNS(NS, "circle"); e.setAttribute("cx", x); e.setAttribute("cy", y); e.setAttribute("r", r); e.setAttribute("fill", fill || c); e.setAttribute("stroke", c); e.setAttribute("stroke-width", 2); svg.appendChild(e); };
    line(`M${cx},${TOP - 24} V${yNow}`, "var(--ink)", 3);
    line(`M${cx - 10},${yNow} H${cx + 10}`, "var(--ink)", 3);
    const conn = (side, y0, anchor, fromX) => {
      const ex = side === "R" ? edge.R - 4 : edge.L + 4;
      const bend = side === "R" ? ex - 10 : ex + 10;
      return Math.abs(anchor - y0) < 1 ? `M${fromX},${y0} H${ex}` : `M${fromX},${y0} H${bend} V${anchor} H${ex}`;
    };
    items.forEach(it => {
      const c = KINDS[it.e.kind].color, y0 = yOf(it.t0);
      if (it.span) {
        const lx = laneX(it.side, it.lane);
        const y1 = it.e.end === "present" ? yNow : yOf(it.t1);
        line(`M${lx},${y0} V${y1}`, c, 4, { opacity: .85 });
        line(conn(it.side, y0, it.anchor, cx), c, 2);
        if (it.endEl) { line(conn(it.side, y1, it.endAnchor, lx), c, 1.5, { "stroke-dasharray": "3 4" }); dot(lx, y1, 3.5, c); }
      } else {
        line(conn(it.side, y0, it.anchor, cx), c, 2);
      }
      dot(cx, y0, 6, c, "var(--page)");
    });
  }
  let t;
  const run = () => { clearTimeout(t); t = setTimeout(layout, 60); };
  window.addEventListener("resize", run);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(layout);
  layout();
})();
