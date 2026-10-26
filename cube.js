/* Renders the cube list (lines like "1 OP01-006 Otama") grouped by set: booster sets, then extra boosters, starter decks, promos. */
(function () {
  var box = document.getElementById("cube-list");
  if (!box) return;
  var order = function (set) { var m = /^([A-Z]+)(\d*)$/.exec(set) || [, set, "0"]; return ({ OP: 0, EB: 1, ST: 2, P: 3 }[m[1]] ?? 4) * 1000 + Number(m[2] || 0); };
  var label = function (set) { var m = /^([A-Z]+)(\d*)$/.exec(set); if (!m) return set; return ({ OP: "Booster ", EB: "Extra booster ", ST: "Starter deck ", P: "Promos" }[m[1]] || set + " ") + (m[1] === "P" ? "" : m[2]); };
  fetch(box.dataset.src).then(function (r) { return r.text(); }).then(function (text) {
    var groups = {};
    text.split("\n").forEach(function (l) {
      var m = /^(\d+)\s+(([A-Z]+\d*)-\d+)\s+(.+)$/.exec(l.trim());
      if (!m) return;
      (groups[m[3]] = groups[m[3]] || []).push({ n: +m[1], id: m[2], name: m[4] });
    });
    Object.keys(groups).sort(function (a, b) { return order(a) - order(b); }).forEach(function (set) {
      var cards = groups[set].sort(function (a, b) { return a.id.localeCompare(b.id, "en", { numeric: true }); });
      var d = document.createElement("details");
      var sm = document.createElement("summary");
      sm.innerHTML = "<b></b><span></span>";
      sm.firstChild.textContent = label(set) + " (" + set + ")";
      sm.lastChild.textContent = cards.length + (cards.length === 1 ? " card" : " cards");
      d.appendChild(sm);
      var ul = document.createElement("ul");
      cards.forEach(function (c) { var li = document.createElement("li"); li.innerHTML = "<code></code> "; li.firstChild.textContent = c.id; li.appendChild(document.createTextNode(c.name + (c.n > 1 ? " ×" + c.n : ""))); ul.appendChild(li); });
      d.appendChild(ul);
      box.appendChild(d);
    });
  }).catch(function () {});
})();
