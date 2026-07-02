/* ============================================================
   MUHAMMAD ALIYU — SITE INTERACTIONS
   Vanilla JS, no dependencies, no build step.
   ============================================================ */
(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Remove any stale service worker + caches from the previous site version */
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
            regs.forEach((r) => r.unregister());
        });
        if (window.caches) {
            caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        initHeader();
        initThemeToggle();
        initReveals();
        initCounters();
        initMarquees();
        initCardSpotlight();
        initCopyButtons();
        initHeroNetwork();
        stampYear();
    });

    /* ------------------------------------------------------
       THEME TOGGLE — light/dark, persisted, system default
       (an inline <head> script applies the theme pre-paint)
       ------------------------------------------------------ */
    function initThemeToggle() {
        const buttons = document.querySelectorAll(".theme-toggle");
        if (!buttons.length) return;

        const apply = (theme) => {
            document.documentElement.setAttribute("data-theme", theme);
            try {
                localStorage.setItem("theme", theme);
            } catch (e) { /* storage unavailable */ }
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.content = theme === "light" ? "#fbfbfd" : "#07080b";
            buttons.forEach((b) =>
                b.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme")
            );
            window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
        };

        apply(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
        buttons.forEach((btn) =>
            btn.addEventListener("click", () => {
                apply(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
            })
        );
    }

    /* ------------------------------------------------------
       HEADER — scrolled state + mobile menu
       ------------------------------------------------------ */
    function initHeader() {
        const header = document.querySelector(".header");
        if (!header) return;

        const onScroll = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 12);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        const toggle = document.querySelector(".header__toggle");
        const nav = document.querySelector(".header__nav");
        if (!toggle || !nav) return;

        const setOpen = (open) => {
            toggle.setAttribute("aria-expanded", String(open));
            nav.classList.toggle("is-open", open);
            document.body.style.overflow = open ? "hidden" : "";
        };

        toggle.addEventListener("click", () => {
            setOpen(toggle.getAttribute("aria-expanded") !== "true");
        });
        nav.querySelectorAll("a").forEach((a) =>
            a.addEventListener("click", () => setOpen(false))
        );
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") setOpen(false);
        });
    }

    /* ------------------------------------------------------
       SCROLL REVEALS — IntersectionObserver + stagger
       ------------------------------------------------------ */
    function initReveals() {
        const els = document.querySelectorAll("[data-reveal]");
        if (!els.length) return;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            els.forEach((el) => el.classList.add("is-in"));
            return;
        }

        // stagger siblings inside a [data-reveal-group]
        document.querySelectorAll("[data-reveal-group]").forEach((group) => {
            group.querySelectorAll(":scope [data-reveal]").forEach((el, i) => {
                el.style.setProperty("--rd", `${Math.min(i * 90, 540)}ms`);
            });
        });

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-in");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
        els.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------------
       COUNT-UP STATS — [data-count] with optional prefix/suffix
       ------------------------------------------------------ */
    function initCounters() {
        const nums = document.querySelectorAll("[data-count]");
        if (!nums.length) return;

        const run = (el) => {
            const target = parseFloat(el.dataset.count);
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            if (reduceMotion || isNaN(target)) {
                el.textContent = prefix + el.dataset.count + suffix;
                return;
            }
            const dur = 1600;
            const t0 = performance.now();
            const tick = (t) => {
                const p = Math.min((t - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 4);
                el.textContent = prefix + Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        if (!("IntersectionObserver" in window)) {
            nums.forEach(run);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        run(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        nums.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------------
       MARQUEES — duplicate track content for a seamless loop
       ------------------------------------------------------ */
    function initMarquees() {
        if (reduceMotion) return;
        document.querySelectorAll(".marquee__track, .t-track").forEach((track) => {
            track.innerHTML += track.innerHTML;
            // mark the clones so screen readers skip them
            const kids = Array.from(track.children);
            kids.slice(kids.length / 2).forEach((el) => el.setAttribute("aria-hidden", "true"));
        });
    }

    /* ------------------------------------------------------
       CARD SPOTLIGHT — pointer-tracked radial highlight
       ------------------------------------------------------ */
    function initCardSpotlight() {
        if (window.matchMedia("(hover: none)").matches) return;
        document.addEventListener("pointermove", (e) => {
            const card = e.target.closest(".card");
            if (!card) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
    }

    /* ------------------------------------------------------
       COPY EMAIL — [data-copy] → clipboard + toast
       ------------------------------------------------------ */
    function initCopyButtons() {
        const buttons = document.querySelectorAll("[data-copy]");
        if (!buttons.length) return;

        let toast = document.querySelector(".toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        let timer;
        const showToast = () => {
            toast.textContent = "Email copied to clipboard";
            toast.classList.add("is-visible");
            clearTimeout(timer);
            timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
        };
        const fallbackCopy = (text) => {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try {
                ok = document.execCommand("copy");
            } catch (e) { /* unsupported */ }
            ta.remove();
            return ok;
        };
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const text = btn.dataset.copy;
                const onFail = () => {
                    if (fallbackCopy(text)) showToast();
                    else window.location.href = "mailto:" + text;
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(showToast).catch(onFail);
                } else {
                    onFail();
                }
            });
        });
    }

    /* ------------------------------------------------------
       HERO NETWORK CANVAS
       Drifting nodes + proximity edges + pulses travelling
       along links — a living map of ecosystem connectivity.
       ------------------------------------------------------ */
    function initHeroNetwork() {
        const canvas = document.getElementById("net-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const hero = canvas.parentElement;
        let W, H, dpr, nodes, pulses, rafId;
        let running = true;
        const cursor = { x: -9999, y: -9999, active: false };

        const CFG = {
            linkDist: 150,
            speed: 0.22,
            pulseChance: 0.012,
        };

        const PAL = {
            dark: {
                node: "rgba(158, 172, 255, 0.75)",
                nodeBig: "rgba(94, 234, 212, 0.8)",
                edge: "143, 160, 255",
                pulse: "94, 234, 212",
                cursorEdge: "165, 180, 252",
                cursorDot: "rgba(199, 210, 254, 0.9)",
            },
            light: {
                node: "rgba(79, 70, 229, 0.5)",
                nodeBig: "rgba(13, 148, 136, 0.65)",
                edge: "79, 70, 229",
                pulse: "13, 148, 136",
                cursorEdge: "79, 70, 229",
                cursorDot: "rgba(79, 70, 229, 0.85)",
            },
        };
        let pal = PAL[document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"];
        window.addEventListener("themechange", (e) => {
            pal = PAL[e.detail === "light" ? "light" : "dark"];
            if (reduceMotion) step();
        });

        function density() {
            const area = W * H;
            return Math.min(Math.floor(area / 16000), 110);
        }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = hero.clientWidth;
            H = hero.clientHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + "px";
            canvas.style.height = H + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            seed();
        }

        function seed() {
            const n = density();
            nodes = Array.from({ length: n }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * CFG.speed,
                vy: (Math.random() - 0.5) * CFG.speed,
                r: Math.random() < 0.12 ? 2.4 : 1.2 + Math.random() * 0.8,
                big: Math.random() < 0.12,
            }));
            pulses = [];
        }

        function step() {
            ctx.clearRect(0, 0, W, H);

            // move
            for (const p of nodes) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = W + 20;
                if (p.x > W + 20) p.x = -20;
                if (p.y < -20) p.y = H + 20;
                if (p.y > H + 20) p.y = -20;
            }

            // edges
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < CFG.linkDist * CFG.linkDist) {
                        const d = Math.sqrt(d2);
                        const alpha = (1 - d / CFG.linkDist) * 0.16;
                        ctx.strokeStyle = `rgba(${pal.edge}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();

                        // occasionally launch a pulse along this edge
                        if (pulses.length < 14 && Math.random() < CFG.pulseChance * (1 - d / CFG.linkDist)) {
                            pulses.push({ a, b, t: 0, v: 0.008 + Math.random() * 0.012 });
                        }
                    }
                }
            }

            // cursor acts as a live node — links reach out to nearby nodes
            if (cursor.active) {
                const reach = CFG.linkDist * 1.25;
                for (const p of nodes) {
                    const dx = p.x - cursor.x;
                    const dy = p.y - cursor.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < reach * reach) {
                        const d = Math.sqrt(d2) || 1;
                        const t = 1 - d / reach;
                        ctx.strokeStyle = `rgba(${pal.cursorEdge}, ${t * 0.35})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(cursor.x, cursor.y);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                        // gentle attraction toward the cursor
                        p.x -= (dx / d) * t * 0.35;
                        p.y -= (dy / d) * t * 0.35;
                    }
                }
                ctx.fillStyle = pal.cursorDot;
                ctx.beginPath();
                ctx.arc(cursor.x, cursor.y, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }

            // pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.t += p.v;
                if (p.t >= 1) {
                    pulses.splice(i, 1);
                    continue;
                }
                const x = p.a.x + (p.b.x - p.a.x) * p.t;
                const y = p.a.y + (p.b.y - p.a.y) * p.t;
                const fade = Math.sin(p.t * Math.PI);
                ctx.fillStyle = `rgba(${pal.pulse}, ${0.85 * fade})`;
                ctx.beginPath();
                ctx.arc(x, y, 1.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(${pal.pulse}, ${0.14 * fade})`;
                ctx.beginPath();
                ctx.arc(x, y, 5.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // nodes
            for (const p of nodes) {
                ctx.fillStyle = p.big ? pal.nodeBig : pal.node;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function loop() {
            if (!running) return;
            step();
            rafId = requestAnimationFrame(loop);
        }

        resize();

        if (reduceMotion) {
            step(); // render a single static frame
            window.addEventListener("resize", () => {
                resize();
                step();
            });
            return;
        }

        loop();
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });

        if (!window.matchMedia("(hover: none)").matches) {
            hero.addEventListener("pointermove", (e) => {
                const r = hero.getBoundingClientRect();
                cursor.x = e.clientX - r.left;
                cursor.y = e.clientY - r.top;
                cursor.active = true;
            });
            hero.addEventListener("pointerleave", () => {
                cursor.active = false;
            });
        }

        // pause when tab hidden or hero off-screen
        document.addEventListener("visibilitychange", () => {
            running = !document.hidden;
            if (running) loop();
            else cancelAnimationFrame(rafId);
        });
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(
                ([entry]) => {
                    const visible = entry.isIntersecting;
                    if (visible && !running) {
                        running = true;
                        loop();
                    } else if (!visible && running && !document.hidden) {
                        running = false;
                        cancelAnimationFrame(rafId);
                    }
                },
                { threshold: 0 }
            ).observe(hero);
        }
    }

    /* ------------------------------------------------------ */
    function stampYear() {
        document.querySelectorAll("[data-year]").forEach((el) => {
            el.textContent = new Date().getFullYear();
        });
    }
})();
