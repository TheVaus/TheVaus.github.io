/* Wikilink previews: hover or focus a .wl link to see a short definition card.
   On touch screens the first tap opens the card, a second tap (or "Open") follows the link. */
(function () {
  const data = window.WIKI || {};
  const card = document.createElement("div");
  card.className = "wl-card";
  card.id = "wl-card";
  card.setAttribute("role", "tooltip");
  card.hidden = true;
  document.body.appendChild(card);
  let current = null, hideTimer = null;

  function show(a) {
    const d = data[a.dataset.wl];
    if (!d) return;
    clearTimeout(hideTimer);
    current = a;
    const here = a.getAttribute("href").startsWith("#");
    card.innerHTML = `<p class="wl-card__title">${d.t}</p><p class="wl-card__text">${d.d}</p>` +
      `<a class="wl-card__go" href="${a.getAttribute("href")}">${here ? "Jump to it" : "Open"}</a>`;
    card.hidden = false;
    a.setAttribute("aria-describedby", "wl-card");
    const r = a.getBoundingClientRect();
    const w = Math.min(320, window.innerWidth - 24);
    card.style.width = w + "px";
    let left = r.left + window.scrollX;
    left = Math.max(12 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - w - 12));
    let top = r.bottom + window.scrollY + 8;
    card.style.left = left + "px";
    card.style.top = top + "px";
    const ch = card.offsetHeight;
    if (r.bottom + ch + 16 > window.innerHeight && r.top - ch - 8 > 0) card.style.top = (r.top + window.scrollY - ch - 8) + "px";
  }
  function hide(now) {
    clearTimeout(hideTimer);
    const go = () => { card.hidden = true; if (current) current.removeAttribute("aria-describedby"); current = null; };
    now ? go() : (hideTimer = setTimeout(go, 180));
  }

  document.querySelectorAll("a.wl").forEach(a => {
    a.addEventListener("mouseenter", () => show(a));
    a.addEventListener("mouseleave", () => hide());
    a.addEventListener("focus", () => show(a));
    a.addEventListener("blur", () => hide());
    a.addEventListener("pointerup", e => {
      if (e.pointerType === "touch" && current !== a) { e.preventDefault(); show(a); a.dataset.armed = "1"; }
    });
    a.addEventListener("click", e => {
      if (a.dataset.armed === "1") { e.preventDefault(); delete a.dataset.armed; }
    });
  });
  card.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  card.addEventListener("mouseleave", () => hide());
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(true); });
  document.addEventListener("pointerdown", e => { if (!card.contains(e.target) && !(e.target.closest && e.target.closest("a.wl"))) hide(true); });
  window.addEventListener("scroll", () => { if (current && !current.matches(":hover")) hide(true); }, { passive: true });
})();
