/* Visit history through GoatCounter (free, no cookies, keeps every visit). Dashboard: https://<CODE>.goatcounter.com
   Set CODE to Daniel's GoatCounter code. Empty = off. Browsers opened with ?me=1 (see notify.js) aren't counted. */
(function () {
  var CODE = "";
  if (!CODE) return;
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("me") === "1") localStorage.setItem("skipgc", "t");
    if (q.get("me") === "0") localStorage.removeItem("skipgc");
  } catch (e) {}
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + CODE + ".goatcounter.com/count");
  document.head.appendChild(s);
})();
