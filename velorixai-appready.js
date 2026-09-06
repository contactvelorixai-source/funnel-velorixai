/* VelorixAI funnel — AppReady Custom JavaScript
   Paste the whole file into AppReady's Custom JavaScript field (no <script> tags).

   What it does, and nothing more:
     1. Fixes the section cut-off / over-scroll issue using measured offsets.
     2. Adds ONE persistent CTA that reuses the existing booking link.
     3. Re-arms the green heading sweep + reveal/orb animations after re-render.
   It never replaces document.body, never clips content, and is idempotent:
   running it again after an AppReady save reuses the same nodes and listeners. */

(function () {
    "use strict";

    if (window.__velorixAppReady) { window.__velorixAppReady.refresh(); return; }

    var STYLE_ID = "velorix-appready-css";
    var CTA_ID = "velorix-sticky-cta";
    var ACCENT = "#A9D622";
    var SWEEP_LIGHT = "#E4F3B4";

    /* Existing destinations. Discovered from the page when present, so the real
       links win; these are only the fallback if no link is found. */
    var FALLBACK_BOOKING = "https://cal.id/velorixai/demo-call?duration=30";
    var FALLBACK_WHATSAPP = "https://wa.me/918218854770";

    /* ------------------------------------------------------------------ utils */

    function onIdle(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
        else fn();
    }

    function rafThrottle(fn) {
        var queued = false;
        return function () {
            if (queued) return;
            queued = true;
            requestAnimationFrame(function () { queued = false; fn(); });
        };
    }

    /* Height of everything pinned to the top of the viewport. Measured by hit-
       testing the top edge rather than guessing at selectors, so AppReady's own
       toolbar/header counts whatever classes or tag it uses. Cheap: three points,
       no full-document walk. */
    function topChromeHeight() {
        if (!document.elementsFromPoint) return 0;
        var max = 0;
        var xs = [window.innerWidth * 0.5, 8, window.innerWidth - 8];

        xs.forEach(function (x) {
            var stack = document.elementsFromPoint(Math.max(0, Math.min(x, window.innerWidth - 1)), 2) || [];
            stack.forEach(function (el) {
                if (!el || el.id === CTA_ID) return;
                if (el === document.body || el === document.documentElement) return;
                var cs = getComputedStyle(el);
                if (cs.position !== "fixed" && cs.position !== "sticky") return;
                if (cs.visibility === "hidden" || cs.display === "none") return;
                var r = el.getBoundingClientRect();
                /* a genuine top bar: sits at the top edge and is a strip, not a panel */
                if (r.top > 4 || r.height === 0 || r.height > window.innerHeight * 0.4) return;
                if (r.bottom > max) max = r.bottom;
            });
        });

        return Math.round(max);
    }

    /* ------------------------------------------------------------------- CSS */

    function css() {
        return [
            /* Scroll anchoring: browser-native, so hash jumps and smooth scrolls
               both land below the header instead of under it. The value is
               refreshed from the measured chrome height. */
            "html{scroll-behavior:smooth}",
            "@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}",

            /* Room at the foot of the document so the persistent CTA can never
               sit on top of the last lines of content. No overflow, no clipping. */
            "body{padding-bottom:var(--velorix-cta-space,104px)!important}",

            /* Nothing in the funnel is allowed to lock to viewport height. */
            "#velorix-scope [style*='100vh']{min-height:100svh!important;height:auto!important}",

            /* ---- persistent CTA ---- */
            "#" + CTA_ID + "{position:fixed;z-index:2147000000;right:max(16px,env(safe-area-inset-right));" +
                "bottom:calc(16px + env(safe-area-inset-bottom));display:inline-flex;align-items:center;gap:8px;" +
                "min-height:52px;padding:14px 26px;border:0;border-radius:999px;background:" + ACCENT + ";" +
                "color:#000;font:700 15px/1 'Plus Jakarta Sans',Inter,system-ui,sans-serif;letter-spacing:.01em;" +
                "text-decoration:none;cursor:pointer;box-shadow:0 10px 30px -8px rgba(0,0,0,.45);" +
                "transition:transform .18s ease,opacity .18s ease;-webkit-tap-highlight-color:transparent}",
            "#" + CTA_ID + ":hover{transform:translateY(-2px);color:#000}",
            "#" + CTA_ID + ":focus-visible{outline:3px solid #fff;outline-offset:3px}",
            /* Never hides on scroll. Only steps aside for an open dialog. */
            "body.velorix-modal-open #" + CTA_ID + "{opacity:0;pointer-events:none}",
            "@media (max-width:640px){#" + CTA_ID + "{left:max(14px,env(safe-area-inset-left));" +
                "right:max(14px,env(safe-area-inset-right));justify-content:center;font-size:16px}}",

            /* ---- green heading sweep: green -> light -> green, right to left ---- */
            ".velorix-sweep,.velorix-sweep-light{" +
                "background-image:linear-gradient(100deg," + ACCENT + " 0%," + ACCENT + " 34%," +
                "#FFF 46%,#FFF 54%," + ACCENT + " 66%," + ACCENT + " 100%);" +
                "background-size:300% 100%;-webkit-background-clip:text;background-clip:text;" +
                "color:transparent;-webkit-text-fill-color:transparent;" +
                "animation:velorix-sweep 3.2s linear infinite}",
            ".velorix-sweep-light{background-image:linear-gradient(100deg," + ACCENT + " 0%," + ACCENT + " 34%," +
                SWEEP_LIGHT + " 46%," + SWEEP_LIGHT + " 54%," + ACCENT + " 66%," + ACCENT + " 100%)}",
            "@keyframes velorix-sweep{from{background-position:100% 0}to{background-position:0% 0}}",

            /* ---- reveal + orb, re-declared so they survive a re-render ---- */
            ".velorix-reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}",
            ".velorix-reveal.is-visible{opacity:1;transform:none}",
            "@keyframes velorix-orb-ring{0%{transform:scale(.6);opacity:0}20%{opacity:.9}100%{transform:scale(1);opacity:0}}",
            "@keyframes velorix-orb-float{0%,100%{transform:translateY(-5px)}50%{transform:translateY(5px)}}",
            ".orb-ring{animation:velorix-orb-ring 4.6s ease-out infinite}",
            ".orb-core{animation:velorix-orb-float 5.5s ease-in-out infinite}",

            "@media (prefers-reduced-motion:reduce){" +
                ".velorix-sweep,.velorix-sweep-light{animation:none;background-image:none;color:" + ACCENT + ";" +
                "-webkit-text-fill-color:" + ACCENT + "}" +
                ".velorix-reveal{opacity:1;transform:none;transition:none}" +
                ".orb-ring,.orb-core{animation:none}}"
        ].join("");
    }

    function injectCss() {
        var el = document.getElementById(STYLE_ID);
        if (!el) {
            el = document.createElement("style");
            el.id = STYLE_ID;
            document.head.appendChild(el);
        }
        if (el.textContent !== css()) el.textContent = css();
    }

    /* ------------------------------------------------- layout / scroll offsets */

    var chrome = 0;

    function syncOffsets() {
        chrome = topChromeHeight();
        var pad = Math.max(88, chrome + 24);
        document.documentElement.style.scrollPaddingTop = (chrome + 24) + "px";
        var cta = document.getElementById(CTA_ID);
        var ctaSpace = cta ? Math.round(cta.getBoundingClientRect().height) + 32 : 104;
        document.documentElement.style.setProperty("--velorix-cta-space", ctaSpace + "px");
        return pad;
    }

    /* AppReady may scroll an inner wrapper rather than the document. Find whichever
       element actually scrolls this target, so navigation works either way. */
    function scrollParent(el) {
        var node = el.parentElement;
        while (node && node !== document.body && node !== document.documentElement) {
            var cs = getComputedStyle(node);
            var oy = cs.overflowY;
            if ((oy === "auto" || oy === "scroll" || oy === "overlay") &&
                node.scrollHeight > node.clientHeight + 4) return node;
            node = node.parentElement;
        }
        return null;
    }

    function scrollToTarget(target) {
        if (!target) return;
        var smooth = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        var container = scrollParent(target);

        if (container) {
            var offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
            var top = container.scrollTop + offset - (chrome + 20);
            var maxIn = container.scrollHeight - container.clientHeight;
            container.scrollTo({ top: Math.max(0, Math.min(top, maxIn)), behavior: smooth });
            return;
        }

        var docTop = target.getBoundingClientRect().top + window.pageYOffset - (chrome + 20);
        var max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.max(0, Math.min(docTop, max)), behavior: smooth });
    }

    /* Delegated once on the document, so no duplicate listeners on re-render. */
    function bindNavigation() {
        if (document.__velorixNavBound) return;
        document.__velorixNavBound = true;

        document.addEventListener("click", function (e) {
            var link = e.target.closest && e.target.closest('a[href^="#"]:not([href="#"])');
            if (!link) return;
            var id = link.getAttribute("href").slice(1);
            var target = document.getElementById(id) || document.querySelector('[name="' + id + '"]');
            if (!target) return;
            e.preventDefault();
            syncOffsets();
            scrollToTarget(target);
            if (history.replaceState) history.replaceState(null, "", "#" + id);
        });

        /* A hash present at load, or AppReady restoring position, can land under
           the header. Re-seat it once layout has settled. */
        function correctHash() {
            if (!location.hash || location.hash === "#") return;
            var target = document.getElementById(location.hash.slice(1));
            if (!target) return;
            syncOffsets();
            requestAnimationFrame(function () { scrollToTarget(target); });
        }
        window.addEventListener("hashchange", correctHash);
        window.addEventListener("load", function () { setTimeout(correctHash, 60); });
        correctHash();
    }

    /* ------------------------------------------------------------ persistent CTA */

    function findBookingHref() {
        var a = document.querySelector('a[href*="cal.id"],a[href*="cal.com"]');
        if (a) return a.getAttribute("href");
        return null;
    }

    function findLeadTrigger() {
        return document.querySelector("[data-open-lead]");
    }

    function ensureCta() {
        var cta = document.getElementById(CTA_ID);
        var trigger = findLeadTrigger();
        var booking = findBookingHref();
        var label = "Book My Free Demo";

        if (!cta) {
            /* An anchor when we go straight to a URL, a button when the page owns
               a lead-capture step. Either way the existing destination is reused. */
            cta = document.createElement(trigger ? "button" : "a");
            cta.id = CTA_ID;
            document.body.appendChild(cta);
        } else if ((trigger && cta.tagName !== "BUTTON") || (!trigger && cta.tagName !== "A")) {
            var replacement = document.createElement(trigger ? "button" : "a");
            replacement.id = CTA_ID;
            cta.parentNode.replaceChild(replacement, cta);
            cta = replacement;
        }

        if (cta.textContent !== label) cta.textContent = label;

        if (cta.tagName === "BUTTON") {
            cta.type = "button";
            cta.removeAttribute("href");
            cta.removeAttribute("target");
            if (!cta.__velorixBound) {
                cta.__velorixBound = true;
                cta.addEventListener("click", function () {
                    var t = findLeadTrigger();
                    if (t) { t.click(); return; }
                    var href = findBookingHref() || FALLBACK_BOOKING;
                    window.location.href = href;
                });
            }
        } else {
            cta.setAttribute("href", booking || FALLBACK_BOOKING);
            cta.setAttribute("target", "_blank");
            cta.setAttribute("rel", "noopener");
        }

        /* Keep the CTA last in the body so nothing paints over it. */
        if (document.body.lastElementChild !== cta) document.body.appendChild(cta);
        return cta;
    }

    /* An open dialog gets the CTA out of the way, without hiding it on scroll. */
    function watchModals() {
        if (document.__velorixModalWatch) return;
        document.__velorixModalWatch = true;
        var check = rafThrottle(function () {
            var open = document.querySelector("[x-modal].is-open, dialog[open], [role='dialog']:not([hidden])");
            document.body.classList.toggle("velorix-modal-open", !!open);
        });
        new MutationObserver(check).observe(document.body, {
            attributes: true, attributeFilter: ["class", "open", "hidden", "style"], subtree: true
        });
        check();
    }

    /* ------------------------------------------------------------- animations */

    /* Green headings only: an element whose computed colour is the accent and
       which is a heading (or a span inside one). Nothing else is touched. */
    function isAccent(el) {
        var c = getComputedStyle(el).color.replace(/\s/g, "");
        return c === "rgb(169,214,34)" || c === "rgb(92,112,0)";
    }

    function groundIsLight(el) {
        var node = el;
        while (node && node !== document.documentElement) {
            var bg = getComputedStyle(node).backgroundColor;
            var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
            if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
                var lum = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
                return lum > 0.5;
            }
            node = node.parentElement;
        }
        return true;
    }

    function applySweep() {
        var candidates = document.querySelectorAll("h1 span,h2 span,h3 span,h1,h2,h3,.sweep,.sweep-light");
        Array.prototype.forEach.call(candidates, function (el) {
            if (el.dataset.velorixSweep === "1") return;
            /* a heading that contains a coloured span is styled on the span, not the whole line */
            if (/^H[1-3]$/.test(el.tagName) && el.querySelector("span")) return;
            var preset = el.classList.contains("sweep") || el.classList.contains("sweep-light");
            if (!preset && !isAccent(el)) return;
            el.dataset.velorixSweep = "1";
            el.classList.add(groundIsLight(el) ? "velorix-sweep-light" : "velorix-sweep");
        });
    }

    function applyReveal() {
        var targets = document.querySelectorAll(".reveal:not([data-velorix-reveal]),.velorix-reveal:not([data-velorix-reveal])");
        if (!targets.length) return;

        var io = window.__velorixIO;
        if (!io && "IntersectionObserver" in window) {
            io = window.__velorixIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                });
            }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
        }

        Array.prototype.forEach.call(targets, function (el) {
            el.dataset.velorixReveal = "1";
            el.classList.add("velorix-reveal");
            if (io) io.observe(el);
            else el.classList.add("is-visible");
        });

        /* Safety net: anything already in view, or missed entirely, is revealed.
           Content is never left at opacity 0. */
        var sweep = rafThrottle(function () {
            var h = window.innerHeight;
            Array.prototype.forEach.call(document.querySelectorAll(".velorix-reveal:not(.is-visible)"), function (el) {
                if (el.getBoundingClientRect().top < h * 0.92) el.classList.add("is-visible");
            });
        });
        sweep();
        if (!window.__velorixRevealScroll) {
            window.__velorixRevealScroll = true;
            window.addEventListener("scroll", sweep, { passive: true });
            window.addEventListener("resize", sweep);
        }
        setTimeout(function () {
            Array.prototype.forEach.call(document.querySelectorAll(".velorix-reveal:not(.is-visible)"), function (el) {
                el.classList.add("is-visible");
            });
        }, 4000);
    }

    /* --------------------------------------------------------------- lifecycle */

    function refresh() {
        injectCss();
        ensureCta();
        syncOffsets();
        applySweep();
        applyReveal();
    }

    function boot() {
        refresh();
        bindNavigation();
        watchModals();

        var onViewport = rafThrottle(syncOffsets);
        window.addEventListener("resize", onViewport);
        window.addEventListener("orientationchange", function () { setTimeout(syncOffsets, 250); });
        if (window.visualViewport) window.visualViewport.addEventListener("resize", onViewport);

        /* AppReady re-renders sections on save/edit. Watch body children only,
           debounced, so new nodes get the CTA, offsets and animations without
           re-initialising anything that already exists. */
        var pending = null;
        new MutationObserver(function () {
            clearTimeout(pending);
            pending = setTimeout(refresh, 180);
        }).observe(document.body, { childList: true, subtree: true });

        window.addEventListener("load", function () { setTimeout(refresh, 120); });
    }

    window.__velorixAppReady = { refresh: refresh, syncOffsets: syncOffsets };
    onIdle(boot);
})();
