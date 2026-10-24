(function () {
  var SALES = "https://ebook.dosementale.fr/";
  var CAPTURE = "https://www.dosementale.fr/ebook";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = document.createElement("style");
  css.textContent = [
    ".read-bar{position:fixed;left:0;top:0;z-index:80;width:100%;height:2px;background:transparent;pointer-events:none}",
    ".read-bar span{display:block;height:100%;width:0;background:#e30613;transform-origin:left center}",
    ".nav-buy{font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;line-height:1.1;text-align:center;max-width:9.6rem;white-space:normal;padding:.6rem .65rem}",
    "@media(min-width:760px){.nav-buy{max-width:none;font-size:.95rem;white-space:nowrap}}",
    reduced ? "" : "@keyframes dm-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}",
    reduced ? "" : ".card,.article-hero,.journal-note{animation:dm-rise .7s ease both}",
    reduced ? "" : ".card:nth-child(2){animation-delay:.05s}.card:nth-child(3){animation-delay:.1s}.card:nth-child(4){animation-delay:.15s}",
    ".offer{position:fixed;inset:0;z-index:90;display:grid;place-items:end center;padding:1rem;background:rgba(0,0,0,.72)}",
    "@media(min-width:760px){.offer{place-items:center}}",
    ".offer[hidden]{display:none}",
    ".offer-card{position:relative;width:min(100%,26rem);background:#0b0b0c;border:1px solid rgba(243,239,230,.16);border-top:2px solid #e30613;padding:1.1rem 1.1rem 1.2rem;box-shadow:0 30px 70px rgba(0,0,0,.55)}",
    ".offer-x{position:absolute;top:.45rem;right:.55rem;background:transparent;color:#f3efe6;border:0;font-size:1.4rem;line-height:1;cursor:pointer;padding:.2rem .35rem}",
    ".offer-book{display:block;width:min(58%,13.5rem);margin:0 auto .9rem;text-decoration:none}",
    ".offer-book img{display:block;width:100%;height:auto}",
    reduced ? "" : "@keyframes dm-float{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-8px) rotate(1.2deg)}}",
    reduced ? "" : ".offer-book img{animation:dm-float 4.8s ease-in-out infinite}",
    ".offer .kicker{text-align:center}",
    ".offer-title{margin:.35rem 0 .4rem;text-align:center;font-family:\"Barlow Condensed\",sans-serif;font-weight:700;font-size:2rem;letter-spacing:.04em;text-transform:uppercase;line-height:.95;color:#f3efe6}",
    ".offer p{text-align:center;color:#d9d3c7;margin:0 0 1rem}",
    ".offer-actions{display:flex;flex-direction:column;gap:.55rem}",
    ".offer-actions .btn{text-align:center}"
  ].join("");
  document.head.appendChild(css);

  var bar = document.createElement("div");
  bar.className = "read-bar";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<span></span>";
  document.body.appendChild(bar);
  var fill = bar.firstChild;
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    fill.style.width = Math.min(100, Math.max(0, p * 100)) + "%";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelectorAll('a[href="https://www.dosementale.fr/paiement"]').forEach(function (a) {
    a.href = SALES;
  });

  var offer = document.createElement("div");
  offer.className = "offer";
  offer.hidden = true;
  offer.innerHTML =
    '<div class="offer-card" role="dialog" aria-modal="true" aria-labelledby="offer-title">' +
    '<button type="button" class="offer-x" aria-label="Fermer">×</button>' +
    '<a class="offer-book" href="' + CAPTURE + '"><img src="/sales/book.jpg" alt="Le Secret des Sigma, couverture noire, rue sous la pluie." width="900" height="1200"/></a>' +
    '<p class="kicker">Le livre</p>' +
    '<p class="offer-title" id="offer-title">Le Secret des Sigma</p>' +
    '<p>L’extrait est gratuit. Le livre, si la ligne est la vôtre.</p>' +
    '<div class="offer-actions"><a class="btn" href="' + CAPTURE + '">Recevoir l’extrait</a><a class="btn btn-ghost" href="' + SALES + '">Lire la page du livre</a></div>' +
    "</div>";
  document.body.appendChild(offer);

  var seen = false;
  try { seen = sessionStorage.getItem("dm-offer") === "1"; } catch (e) {}
  function shut() {
    offer.hidden = true;
    try { sessionStorage.setItem("dm-offer", "1"); } catch (e) {}
  }
  function open() {
    if (seen || !offer.hidden) return;
    seen = true;
    offer.hidden = false;
  }
  offer.querySelector(".offer-x").addEventListener("click", shut);
  offer.addEventListener("click", function (e) { if (e.target === offer) shut(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") shut(); });
  setTimeout(open, 42000);
  window.addEventListener("scroll", function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (max > 0 && h.scrollTop / max > 0.62) open();
  }, { passive: true });
})();
