(function () {
  var SALES = "https://ebook.dosementale.fr/";
  var CAPTURE = "https://www.dosementale.fr/ebook";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = document.createElement("style");
  css.textContent = [
    ".read-bar{position:fixed;left:0;top:0;z-index:100;width:100%;height:3px;background:rgba(227,6,19,.18);pointer-events:none}",
    ".read-bar span{display:block;height:100%;width:0;background:#e30613}",
    ".nav-buy{font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;line-height:1.1;text-align:center;max-width:9.6rem;white-space:normal;padding:.6rem .65rem}",
    "@media(min-width:760px){.nav-buy{max-width:none;font-size:.95rem;white-space:nowrap}}",
    reduced ? "" : "@keyframes dm-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}",
    reduced ? "" : ".card,.journal-note{animation:dm-rise .7s ease both}",
    reduced ? "" : ".card:nth-child(2){animation-delay:.05s}.card:nth-child(3){animation-delay:.1s}.card:nth-child(4){animation-delay:.15s}",
    ".title-draw{display:block;width:4.2rem;height:2px;margin-top:.7rem;background:#e30613;transform-origin:left center}",
    reduced ? ".title-draw{transform:none}" : "@keyframes dm-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}.title-draw{transform:scaleX(0);animation:dm-draw .8s ease .15s forwards}",
    ".hero-frame{overflow:hidden}",
    ".hero-frame .article-hero{display:block;width:100%;height:auto}",
    reduced ? "" : "@keyframes dm-breathe{from{transform:scale(1.02)}to{transform:scale(1.07)}}.hero-frame .article-hero{animation:dm-breathe 28s ease-in-out infinite alternate}",
    ".toc a.is-here{color:#e30613}",
    ".remain{color:#9a938a}",
    ".live-pill{position:fixed;left:.8rem;bottom:.8rem;z-index:70;display:flex;align-items:center;gap:.45rem;padding:.4rem .7rem;background:#0b0b0c;color:#f3efe6;border:1px solid rgba(243,239,230,.16);font-size:.78rem;letter-spacing:.04em}",
    ".live-dot{width:.45rem;height:.45rem;border-radius:50%;background:#e30613;flex:none}",
    reduced ? "" : "@keyframes dm-pulse{0%,100%{opacity:1}50%{opacity:.35}}.live-dot{animation:dm-pulse 2.4s ease-in-out infinite}",
    ".buy-toast{position:fixed;left:.8rem;right:.8rem;bottom:3.2rem;z-index:70;display:flex;gap:.75rem;align-items:center;max-width:24rem;padding:.75rem .85rem;background:#0b0b0c;color:#f3efe6;border:1px solid rgba(243,239,230,.16);border-left:2px solid #e30613;box-shadow:0 18px 40px rgba(0,0,0,.45);text-decoration:none}",
    ".buy-toast[hidden]{display:none}",
    ".buy-toast strong{display:block;font-family:\"Barlow Condensed\",sans-serif;font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:1.05rem;line-height:1}",
    ".buy-toast span{display:block;margin-top:.15rem;color:#b7b1a6;font-size:.78rem}",
    "@media(min-width:760px){.buy-toast{right:auto;width:22rem}}",
    ".offer{position:fixed;inset:0;z-index:90;display:grid;place-items:end center;padding:1rem;background:rgba(0,0,0,.72)}",
    "@media(min-width:760px){.offer{place-items:center}}",
    ".offer[hidden]{display:none}",
    ".offer-card{position:relative;width:min(100%,26rem);background:#0b0b0c;border:1px solid rgba(243,239,230,.16);border-top:2px solid #e30613;padding:1.1rem 1.1rem 1.2rem;box-shadow:0 30px 70px rgba(0,0,0,.55)}",
    ".offer-x{position:absolute;top:.45rem;right:.55rem;background:transparent;color:#f3efe6;border:0;font-size:1.4rem;line-height:1;cursor:pointer;padding:.2rem .35rem}",
    ".offer-book{display:block;width:min(58%,13.5rem);margin:0 auto .9rem;text-decoration:none}",
    ".offer-book img{display:block;width:100%;height:auto}",
    reduced ? "" : "@keyframes dm-float{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-8px) rotate(1.2deg)}}.offer-book img{animation:dm-float 4.8s ease-in-out infinite}",
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

  document.querySelectorAll("h1.display, h1.journal-display").forEach(function (h) {
    if (h.querySelector(".title-draw")) return;
    var s = document.createElement("span");
    s.className = "title-draw";
    s.setAttribute("aria-hidden", "true");
    h.appendChild(s);
  });

  document.querySelectorAll("img.article-hero").forEach(function (img) {
    if (img.parentElement && img.parentElement.classList.contains("hero-frame")) return;
    var frame = document.createElement("div");
    frame.className = "hero-frame";
    img.parentNode.insertBefore(frame, img);
    frame.appendChild(img);
  });

  var prose = document.querySelector(".prose");
  var heads = prose ? Array.prototype.slice.call(prose.querySelectorAll("h2[id]")) : [];
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var remain = null;
  var minutes = 6;
  var byline = document.querySelector(".byline");
  if (byline) {
    var match = (byline.textContent || "").match(/(\d+)\s*min/);
    if (match) minutes = parseInt(match[1], 10) || 6;
    remain = document.createElement("span");
    remain.className = "remain";
    byline.appendChild(remain);
  }

  function paint() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    fill.style.width = Math.min(100, Math.max(0, p * 100)) + "%";
    if (prose && remain) {
      var top = prose.getBoundingClientRect().top + h.scrollTop;
      var height = Math.max(prose.offsetHeight, 1);
      var seen = (h.scrollTop + h.clientHeight * 0.35 - top) / height;
      seen = Math.min(1, Math.max(0, seen));
      var left = Math.max(0, Math.ceil(minutes * (1 - seen)));
      remain.textContent = left <= 0 ? " · fin du texte" : " · " + left + " min restante" + (left > 1 ? "s" : "");
    }
    if (heads.length && tocLinks.length) {
      var mark = heads[0];
      heads.forEach(function (head) {
        if (head.getBoundingClientRect().top < 140) mark = head;
      });
      tocLinks.forEach(function (a) {
        a.classList.toggle("is-here", a.getAttribute("href") === "#" + mark.id);
      });
    }
  }
  paint();
  window.addEventListener("scroll", paint, { passive: true });

  document.querySelectorAll('a[href="https://www.dosementale.fr/paiement"]').forEach(function (a) {
    a.href = SALES;
  });

  var readers = 6 + Math.floor(Math.random() * 9);
  var pill = document.createElement("p");
  pill.className = "live-pill";
  pill.innerHTML = '<i class="live-dot" aria-hidden="true"></i><span></span>';
  document.body.appendChild(pill);
  var pillText = pill.querySelector("span");
  function paintReaders() {
    pillText.textContent = readers + (readers > 1 ? " personnes lisent" : " personne lit");
  }
  paintReaders();
  setInterval(function () {
    var step = Math.random() < 0.5 ? -1 : 1;
    readers = Math.min(22, Math.max(4, readers + step));
    paintReaders();
  }, 16000);

  var names = ["Léa", "Marc", "Inès", "Hugo", "Chloé", "Julien", "Sarah", "Antoine", "Manon", "Camille", "Adam", "Louise", "Thomas", "Nina"];
  var cities = ["Lyon", "Lille", "Nantes", "Bordeaux", "Toulouse", "Marseille", "Rennes", "Strasbourg", "Montpellier", "Nice", "Grenoble", "Paris"];
  var times = ["il y a 12 min", "il y a 26 min", "il y a 1 h", "il y a 2 h", "il y a 3 h", "il y a 5 h", "hier"];
  var toast = document.createElement("a");
  toast.className = "buy-toast";
  toast.href = SALES;
  toast.hidden = true;
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = "<div><strong></strong><span></span></div>";
  document.body.appendChild(toast);
  var toastName = toast.querySelector("strong");
  var toastWhen = toast.querySelector("span");
  function showToast() {
    if (!offer.hidden) return;
    var name = names[Math.floor(Math.random() * names.length)];
    var city = cities[Math.floor(Math.random() * cities.length)];
    var when = times[Math.floor(Math.random() * times.length)];
    toastName.textContent = name + ", " + city;
    toastWhen.textContent = "a pris le livre · " + when;
    toast.hidden = false;
    setTimeout(function () { toast.hidden = true; }, 6500);
  }

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
  function openOffer() {
    if (seen || !offer.hidden) return;
    seen = true;
    toast.hidden = true;
    offer.hidden = false;
  }
  offer.querySelector(".offer-x").addEventListener("click", shut);
  offer.addEventListener("click", function (e) { if (e.target === offer) shut(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") shut(); });
  setTimeout(openOffer, 48000);
  window.addEventListener("scroll", function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (max > 0 && h.scrollTop / max > 0.72) openOffer();
  }, { passive: true });

  setTimeout(showToast, 14000);
  setInterval(showToast, 36000);
})();
