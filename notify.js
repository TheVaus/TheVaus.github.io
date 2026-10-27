/* Sends Daniel a phone notification (via ntfy.sh) the first time someone opens the site in a browser session.
   No cookies and nothing personal: only the page title, the site that linked here, if any, and the browser's time zone.
   Open any page with ?me=1 to stop notifications from that browser (?me=0 turns them back on). */
(function () {
  var TOPIC = "dv-portfolio-n1k2nhd3waaux0lv";
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("me") === "1") { localStorage.setItem("dv-owner", "1"); return; }
    if (q.get("me") === "0") { localStorage.removeItem("dv-owner"); }
    if (localStorage.getItem("dv-owner") === "1") return;
    if (sessionStorage.getItem("dv-pinged")) return;
    if (navigator.webdriver || /bot|crawl|spider|preview|headless/i.test(navigator.userAgent)) return;
    sessionStorage.setItem("dv-pinged", "1");
  } catch (e) { return; }
  var page = document.title.replace(/, Daniel Vekar$/, "");
  var from = "";
  try { if (document.referrer && new URL(document.referrer).host !== location.host) from = " (from " + new URL(document.referrer).host + ")"; } catch (e) {}
  // Region: the browser's own time zone (e.g. "Europe/Berlin"). Nothing is looked up or sent anywhere else.
  var region = "";
  try { region = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var url = "https://ntfy.sh/" + TOPIC + "?title=" + encodeURIComponent("Portfolio visit") + "&tags=eyes";
  try { fetch(url, { method: "POST", body: "Someone opened " + page + from + (region ? " | " + region : ""), keepalive: true, mode: "cors" }).catch(function () {}); } catch (e) {}
})();
