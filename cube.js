/* Cube page: the version table and the card list, both from cube/versions.json (kept up to date weekly by
   .github/workflows/cube-sync.yml). Lists are lines like "1 OP01-006 Otama" or "1xOP17-039", grouped by set. */
(function () {
  var box = document.getElementById("cube-list");
  if (!box) return;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var KIND = { OP: [0, "Booster "], EB: [1, "Extra booster "], PRB: [2, "Premium booster "], ST: [3, "Starter deck "], P: [4, "Promos"] };
  var parts = function (set) { return /^([A-Z]+)(\d*)$/.exec(set) || [set, set, ""]; };
  var order = function (set) { var m = parts(set); return (KIND[m[1]] ? KIND[m[1]][0] : 9) * 1000 + Number(m[2] || 0); };
  var label = function (set) { var m = parts(set); return KIND[m[1]] ? KIND[m[1]][1] + m[2] : set; };
  var month = function (ym) { var p = ym.split("-"); return MONTHS[+p[1] - 1] + " " + p[0]; };
  var el = function (tag, text) { var e = document.createElement(tag); if (text != null) e.textContent = text; return e; };

  function render(v) {
    [].slice.call(box.querySelectorAll("details")).forEach(function (d) { d.remove(); });
    fetch(v.file).then(function (r) { return r.text(); }).then(function (text) {
      var groups = {}, total = 0, named = false;
      text.split("\n").forEach(function (l) {
        var m = /^(\d+)\s*x?\s*(([A-Z]+\d*)-\d+)\s*(.*)$/.exec(l.trim());
        if (!m) return;
        total += +m[1];
        if (m[4]) named = true;
        (groups[m[3]] = groups[m[3]] || []).push({ n: +m[1], id: m[2], name: m[4] });
      });
      document.getElementById("cube-caption").textContent = "Version " + v.version + ": " + total + " cards, grouped by set." + (named ? "" : " This list has card numbers only.");
      Object.keys(groups).sort(function (a, b) { return order(a) - order(b); }).forEach(function (set) {
        var cards = groups[set].sort(function (a, b) { return a.id.localeCompare(b.id, "en", { numeric: true }); });
        var d = el("details"), sm = el("summary"), ul = el("ul");
        sm.appendChild(el("b", label(set) + " (" + set + ")"));
        sm.appendChild(el("span", cards.length + (cards.length === 1 ? " card" : " cards")));
        d.appendChild(sm);
        cards.forEach(function (c) {
          var li = el("li");
          li.appendChild(el("code", c.id));
          li.appendChild(document.createTextNode(" " + c.name + (c.n > 1 ? " ×" + c.n : "")));
          ul.appendChild(li);
        });
        d.appendChild(ul);
        box.appendChild(d);
      });
    }).catch(function () {});
  }

  fetch("cube/versions.json").then(function (r) { return r.json(); }).then(function (meta) {
    var vs = meta.versions, latest = vs[0];
    document.getElementById("cube-pool").textContent = latest.cards + " cards (version " + latest.version + ", " + month(latest.date) + ")";
    var tbody = document.getElementById("cube-versions");
    tbody.textContent = "";
    var buttons = [];
    vs.forEach(function (v, i) {
      var tr = el("tr"), th = el("th", String(v.version)), btn = el("button", "Show"), a = el("a", "Text"), td = el("td");
      th.scope = "row";
      tr.appendChild(th);
      tr.appendChild(el("td", month(v.date)));
      tr.appendChild(el("td", String(v.cards)));
      tr.appendChild(el("td", v.added == null ? "First list" : v.added + " added, " + v.removed + " removed"));
      btn.type = "button"; btn.className = "cube-show"; btn.setAttribute("aria-pressed", String(i === 0));
      btn.addEventListener("click", function () { buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); }); render(v); });
      buttons.push(btn);
      a.href = v.file;
      td.appendChild(btn); td.appendChild(document.createTextNode(" ")); td.appendChild(a);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    render(latest);
  }).catch(function () {});
})();
