/* Renders a cube list grouped by set: booster sets, extra boosters, premium boosters, starter decks, promos.
   Accepts "1 OP01-006 Otama" (version 1) and "1xOP17-039" (version 2) lines. The version table's Show buttons switch lists. */
(function () {
  var box = document.getElementById("cube-list");
  if (!box) return;
  var KIND = { OP: [0, "Booster "], EB: [1, "Extra booster "], PRB: [2, "Premium booster "], ST: [3, "Starter deck "], P: [4, "Promos"] };
  var parts = function (set) { return /^([A-Z]+)(\d*)$/.exec(set) || [set, set, ""]; };
  var order = function (set) { var m = parts(set); return (KIND[m[1]] ? KIND[m[1]][0] : 9) * 1000 + Number(m[2] || 0); };
  var label = function (set) { var m = parts(set); return KIND[m[1]] ? KIND[m[1]][1] + m[2] : set; };

  function render(src, name) {
    [].slice.call(box.querySelectorAll("details")).forEach(function (d) { d.remove(); });
    fetch(src).then(function (r) { return r.text(); }).then(function (text) {
      var groups = {}, total = 0;
      text.split("\n").forEach(function (l) {
        var m = /^(\d+)\s*x?\s*(([A-Z]+\d*)-\d+)\s*(.*)$/.exec(l.trim());
        if (!m) return;
        total += +m[1];
        (groups[m[3]] = groups[m[3]] || []).push({ n: +m[1], id: m[2], name: m[4] });
      });
      document.getElementById("cube-caption").textContent = name + ": " + total + " cards, one copy of each, grouped by set." + (/v2/.test(src) ? " This list has card numbers only." : "");
      Object.keys(groups).sort(function (a, b) { return order(a) - order(b); }).forEach(function (set) {
        var cards = groups[set].sort(function (a, b) { return a.id.localeCompare(b.id, "en", { numeric: true }); });
        var d = document.createElement("details");
        var sm = document.createElement("summary");
        sm.innerHTML = "<b></b><span></span>";
        sm.firstChild.textContent = label(set) + " (" + set + ")";
        sm.lastChild.textContent = cards.length + (cards.length === 1 ? " card" : " cards");
        d.appendChild(sm);
        var ul = document.createElement("ul");
        cards.forEach(function (c) {
          var li = document.createElement("li");
          li.innerHTML = "<code></code> ";
          li.firstChild.textContent = c.id;
          li.appendChild(document.createTextNode(c.name + (c.n > 1 ? " ×" + c.n : "")));
          ul.appendChild(li);
        });
        d.appendChild(ul);
        box.appendChild(d);
      });
    }).catch(function () {});
  }

  [].slice.call(document.querySelectorAll(".cube-show")).forEach(function (b) {
    b.addEventListener("click", function () {
      [].slice.call(document.querySelectorAll(".cube-show")).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      render(b.dataset.src, b.dataset.label);
    });
  });
  render(box.dataset.src, "Version 2");
})();
