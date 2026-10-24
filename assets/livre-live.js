(function () {
  var SALES = "https://ebook.dosementale.fr/";
  var questions = [
    { prompt: "Quand la pièce se remplit, vous…", choices: [
      ["Vous prenez la parole pour qu’on vous compte.", "foule"],
      ["Vous regardez, puis vous choisissez si vous parlez.", "ligne"],
      ["Vous vous effacez pour qu’on ne vous voie pas hésiter.", "masque"]
    ]},
    { prompt: "Un mensonge vous arrangerait. Vous…", choices: [
      ["Le reprenez, juste assez pour passer.", "masque"],
      ["Le laissez à celui qui le porte.", "ligne"],
      ["L’embellissez. Il passera mieux.", "foule"]
    ]},
    { prompt: "Votre colère, vous…", choices: [
      ["La retournez contre vous, en silence.", "masque"],
      ["La tenez, sans la laisser réécrire votre visage.", "ligne"],
      ["La donnez à la salle, pour qu’elle vous suive.", "foule"]
    ]},
    { prompt: "Une victoire qui humilie l’autre…", choices: [
      ["Est la seule qui compte.", "foule"],
      ["N’est pas une victoire.", "ligne"],
      ["Dépend de qui regarde.", "masque"]
    ]},
    { prompt: "Le soir, seul, vous…", choices: [
      ["Remplissez le silence pour ne pas vous entendre.", "foule"],
      ["Restez avec ce qui est vrai, même si c’est étroit.", "ligne"],
      ["Rejouez la journée jusqu’à avoir raison.", "masque"]
    ]},
    { prompt: "On vous propose un rôle qui paie, et qui vous coûte. Vous…", choices: [
      ["Le prenez. On verra plus tard.", "foule"],
      ["Le refusez si le prix, c’est vous.", "ligne"],
      ["Le prenez, et vous changez le nom de ce que ça coûte.", "masque"]
    ]}
  ];
  var results = {
    ligne: ["Vous tenez déjà une ligne.", "Le livre ne va pas vous inventer un personnage. Il nomme ce que vous refusez déjà de troquer, et il montre où la pièce essaie encore de vous l’acheter. Il sert à ce que la ligne reste nette quand personne ne vous applaudit."],
    foule: ["Vous négociez encore.", "Vous n’êtes pas perdu. Vous payez, par petites pièces, une place dans la salle. Le livre arrête le marché au moment où il commence — avant que le costume ne vous aille trop bien."],
    masque: ["Le mensonge commence à vous aller.", "Pas le grand mensonge. Le petit : celui qui arrange la phrase, le visage, la victoire. Le Secret des Sigma est un miroir, pas un nouveau costume. Il sert à voir la copie avant qu’elle ne prenne votre nom."]
  };
  var chapters = [
    ["01", "La pièce pleine", "Ce que le silence veut dire quand tout le monde parle. Disparaître n’est pas la même chose que choisir de ne pas jouer.", "/sales/street.svg", "Rue mouillée la nuit, un homme s’éloigne sous la pluie."],
    ["02", "Ne pas lui ressembler", "Le menteur est simple tant qu’il reste en face. Il devient dangereux le jour où sa phrase vous arrange.", "/sales/mirror.svg", "Homme de profil devant un miroir au cadre rouge, pièce sombre."],
    ["03", "L’émotion sans corruption", "Tenir la colère, la peur, l’orgueil — sans les laisser décider à votre place, ni réécrire votre visage.", "/sales/rain.svg", "Pluie sur une vitre, une lumière rouge derrière les gouttes."],
    ["04", "La victoire qui n’écrase pas", "Gagner n’est pas humilier. Ce chapitre sépare la force de la copie de celui que vous combattez.", "/sales/alley.svg", "Ruelle sombre, une porte au cadre rouge, chapeau au premier plan."],
    ["05", "La ligne sous la pluie", "Ce qui reste quand personne ne regarde, et quand être regardé ne paie plus.", "/sales/cover.svg", "Homme de dos, manteau et chapeau, rue sous la pluie."],
    ["06", "Rester", "Le dernier mouvement n’est pas une sortie spectaculaire. C’est la décision de ne pas vous abandonner pour être admis.", "/sales/mirror.svg", "Silence d’une pièce austère, miroir étroit cerclé de rouge."]
  ];
  var lines = [
    "La salle n’a pas besoin que vous soyez vrai. Elle a besoin que vous soyez lisible. Le livre commence là où vous refusez d’être lisible à ce prix.",
    "On vous dira que maîtriser, c’est ne plus rien sentir. C’est l’inverse. Maîtriser, c’est sentir sans vous laisser réécrire.",
    "La plus mauvaise victoire est celle qui vous apprend le visage de l’autre. Vous rentrez. Le miroir a changé de camp."
  ];
  var faqs = [
    ["Qu’est-ce que j’achète exactement ?", "Le Secret des Sigma, le livre numérique de Gabriel Constant. Pas une formation. Pas un groupe. Pas un statut à afficher."],
    ["À qui s’adresse-t-il ?", "À ceux qui sentent que la performance sociale leur coûte quelque chose qu’ils ne veulent plus payer. Si vous cherchez une méthode pour dominer une pièce, ce livre n’est pas pour vous."],
    ["Est-ce un guide de manipulation ?", "Non. Le livre refuse précisément de vous apprendre à ressembler au menteur. Il tient la ligne inverse."],
    ["Comment je le reçois ?", "Vous lisez d’abord la page du livre. Le paiement se fait ensuite sur Systeme.io. La livraison part de là, juste après le paiement."],
    ["Pourquoi 19,99 €, et pas 69,99 € ?", "69,99 € est le prix de référence. Le livre est proposé à 19,99 €. Pas de compte à rebours. Pas de fausse rareté."],
    ["Qui est Gabriel Constant ?", "L’auteur, sous Dose Mentale. Il écrit pour ceux qui restent, pas pour ceux qui se montrent."]
  ];

  var quiz = document.querySelector(".quiz");
  if (quiz) {
    var step = 0;
    var tags = {};
    function drawQuiz() {
      var ticks = questions.map(function (_, i) {
        return '<span class="tick' + (i < step ? " on" : "") + '"></span>';
      }).join("");
      if (step >= questions.length) {
        var score = { ligne: 0, foule: 0, masque: 0 };
        Object.keys(tags).forEach(function (k) { score[tags[k]] += 1; });
        var win = ["masque", "foule", "ligne"].reduce(function (a, b) { return score[b] > score[a] ? b : a; });
        var res = results[win];
        quiz.innerHTML = '<div class="ticks" aria-hidden="true">' + ticks + '</div><div><p class="kicker">Votre ligne</p><h3 class="result-name">' + res[0] + '</h3><p class="lede">' + res[1] + '</p><div class="hero-actions"><a class="btn" href="' + SALES + '">Lire le livre</a><button class="text-btn" type="button" data-reset>Recommencer</button></div></div>';
        quiz.querySelector("[data-reset]").addEventListener("click", function () { step = 0; tags = {}; drawQuiz(); });
        return;
      }
      var q = questions[step];
      quiz.innerHTML = '<div class="ticks" aria-hidden="true">' + ticks + '</div><div><p class="muted" style="margin-top:0">' + (step + 1) + " / " + questions.length + '</p><h3 class="quiz-prompt">' + q.prompt + '</h3><div class="choices" style="margin-top:1rem">' + q.choices.map(function (c, i) {
        return '<button class="choice" type="button" data-i="' + i + '">' + c[0] + "</button>";
      }).join("") + '</div><div class="quiz-nav"><button class="text-btn" type="button" data-back' + (step === 0 ? " disabled" : "") + '>Retour</button><span class="muted">Répondez sans vous arranger.</span></div></div>';
      quiz.querySelectorAll(".choice").forEach(function (btn) {
        btn.addEventListener("click", function () {
          tags[step] = q.choices[Number(btn.getAttribute("data-i"))][1];
          step += 1;
          drawQuiz();
        });
      });
      var back = quiz.querySelector("[data-back]");
      back.addEventListener("click", function () {
        if (step === 0) return;
        step -= 1;
        drawQuiz();
      });
    }
    drawQuiz();
  }

  var detail = document.querySelector(".chapter-detail");
  var chapterBtns = Array.prototype.slice.call(document.querySelectorAll(".chapter-btn"));
  function showChapter(i) {
    var c = chapters[i];
    chapterBtns.forEach(function (btn, n) {
      btn.classList.toggle("active", n === i);
      if (n === i) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
    if (!detail) return;
    var img = detail.querySelector("img");
    if (img) { img.src = c[3]; img.alt = c[4]; }
    var kick = detail.querySelector(".kicker");
    if (kick) kick.textContent = "Chapitre " + c[0];
    var h = detail.querySelector("h3");
    if (h) h.textContent = c[1];
    var p = detail.querySelector(".lede");
    if (p) p.textContent = c[2];
  }
  chapterBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { showChapter(i); });
  });

  var reader = document.querySelector(".reader");
  if (reader) {
    var line = 0;
    var text = reader.querySelector("p:not(.kicker)");
    var label = reader.querySelector(".kicker");
    var count = reader.querySelector(".reader-bar .muted");
    var buttons = reader.querySelectorAll(".text-btn");
    function showLine() {
      if (text) text.textContent = lines[line];
      if (label) label.textContent = "Ligne 0" + (line + 1);
      if (count) count.textContent = (line + 1) + " / " + lines.length;
    }
    if (buttons[0]) buttons[0].addEventListener("click", function () { line = line === 0 ? lines.length - 1 : line - 1; showLine(); });
    if (buttons[1]) buttons[1].addEventListener("click", function () { line = (line + 1) % lines.length; showLine(); });
  }

  document.querySelectorAll("#questions .faq-item").forEach(function (item, i) {
    var btn = item.querySelector("button");
    if (!btn || !faqs[i]) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll("#questions .faq-item").forEach(function (other, n) {
        var b = other.querySelector("button");
        var mark = other.querySelector(".mark");
        var ans = other.querySelector(".answer");
        if (b) b.setAttribute("aria-expanded", "false");
        if (mark) mark.textContent = "+";
        if (ans) ans.remove();
        if (!open && n === i) {
          b.setAttribute("aria-expanded", "true");
          if (mark) mark.textContent = "–";
          var p = document.createElement("p");
          p.className = "answer";
          p.textContent = faqs[n][1];
          other.appendChild(p);
        }
      });
    });
  });
})();
