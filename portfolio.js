var info = document.getElementById("info");
var uno = document.getElementById("uno"); 
function modal() {
    uno.style.visibility = "visible";
}
info.onclick = modal;


// Project table of contents: built from the project cards, highlights the project in view.
(function () {
    var list = document.getElementById("toc");
    if (!list) return;
    var projects = [];
    var cards = document.querySelectorAll(".main .project");
    for (var i = 0; i < cards.length; i++) {
        var title = cards[i].querySelector(".p1");
        if (!title) continue;
        var id = "project-" + title.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        cards[i].id = id;
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + id;
        a.textContent = title.textContent;
        li.appendChild(a);
        list.appendChild(li);
        projects.push({ card: cards[i], link: a });
    }
    if (!projects.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = null;

    function setActive(p) {
        if (p === current) return;
        if (current) current.link.removeAttribute("aria-current");
        current = p;
        if (p) p.link.setAttribute("aria-current", "true");
    }

    function update() {
        var line = window.innerHeight * 0.4;
        var active = projects[0];
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].card.getBoundingClientRect().top <= line) active = projects[i];
        }
        // At the very bottom of the page, highlight the last project.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            active = projects[projects.length - 1];
        }
        setActive(active);
    }

    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { ticking = false; update(); });
    }

    list.addEventListener("click", function (e) {
        var a = e.target.closest ? e.target.closest("a") : null;
        if (!a) return;
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (history.replaceState) history.replaceState(null, "", a.getAttribute("href"));
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].link === a) setActive(projects[i]);
        }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();
