/* VelorixAI website behaviour. Content lives in the HTML; this file only
   handles interaction: mobile menu, package tabs, FAQ accordion, scroll reveal. */

(function () {
    "use strict";

    /* mobile menu */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        nav.addEventListener("click", function (e) {
            if (e.target.closest("a")) {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* package tabs */
    var tabs = document.querySelectorAll("[data-tab]");
    if (tabs.length) {
        Array.prototype.forEach.call(tabs, function (tab) {
            tab.addEventListener("click", function () {
                Array.prototype.forEach.call(tabs, function (t) {
                    var on = t === tab;
                    t.setAttribute("aria-selected", on ? "true" : "false");
                    var panel = document.getElementById(t.getAttribute("data-tab"));
                    if (panel) panel.hidden = !on;
                });
            });
        });
    }

    /* FAQ accordion */
    var faq = document.querySelector(".faq-list");
    if (faq) {
        faq.addEventListener("click", function (e) {
            var btn = e.target.closest(".faq-q");
            if (!btn) return;
            var answer = document.getElementById(btn.getAttribute("aria-controls"));
            var open = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", open ? "false" : "true");
            if (answer) answer.hidden = open;
        });
    }

    /* Scroll reveal. Opt-in: the .js-reveal class is what hides anything, so if
       this script fails or never runs the content stays visible. A rect pass on
       load and on scroll backs up IntersectionObserver, and a timeout reveals
       everything as a last resort. */
    var targets = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!targets.length) return;

    document.documentElement.classList.add("js-reveal");

    function revealAll() {
        targets.forEach(function (el) { el.classList.add("is-visible"); });
    }

    function checkInView() {
        var h = window.innerHeight || document.documentElement.clientHeight;
        var pending = false;
        targets.forEach(function (el) {
            if (el.classList.contains("is-visible")) return;
            var r = el.getBoundingClientRect();
            // anything at or above the viewport counts, so an element scrolled
            // past during a hash jump is caught by the next pass, not stranded
            if (r.top < h * 0.92) el.classList.add("is-visible");
            else pending = true;
        });
        return pending;
    }

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
        targets.forEach(function (el) { io.observe(el); });
    }

    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            ticking = false;
            if (!checkInView()) {
                window.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", onScroll);
            }
        });
    }

    checkInView();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", checkInView);
    window.addEventListener("hashchange", function () { window.setTimeout(checkInView, 700); });
    window.setTimeout(revealAll, 4000);
})();
