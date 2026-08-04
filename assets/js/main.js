import { App } from "./core/app.js";
import { mountSharedNavbar } from "./components/navbar-template.js";
import { initProjectsGallery } from "./components/projects-gallery.js";

const THEME_STORAGE_KEY = "evolve-theme";

const getStoredTheme = () => {

    try {
        return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (_error) {
        return null;
    }

};

const storeTheme = (theme) => {

    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_error) {
        // Ignore storage failures.
    }

};

const applyTheme = (theme) => {

    document.documentElement.setAttribute("data-theme", theme);

    const toggle = document.querySelector(".nav-theme-toggle");

    if (!toggle) {
        return;
    }

    const isDark = theme === "dark";
    const icon = toggle.querySelector(".theme-icon");
    const switchingToTheme = isDark ? "light" : "dark";

    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    if (icon) {
        icon.textContent = switchingToTheme === "dark" ? "◐" : "☀";
    }

};

const toggleThemeState = () => {

    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    storeTheme(nextTheme);

};

const initThemeToggle = () => {

    const prefersDark = typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
    const initialTheme = getStoredTheme() || (prefersDark ? "dark" : "light");

    applyTheme(initialTheme);

    const toggle = document.querySelector(".nav-theme-toggle");

    if (!toggle) {
        return;
    }

    const toggleTheme = (event) => {

        event.preventDefault();
        toggleThemeState();

    };

    toggle.addEventListener("keydown", (event) => {

        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        toggleTheme(event);

    });

    document.addEventListener("click", (event) => {

        const delegatedToggle = event.target.closest(".nav-theme-toggle");

        if (!delegatedToggle || delegatedToggle !== toggle) {
            return;
        }

        event.preventDefault();
        toggleThemeState();

    });

};

const initImpactCardFlip = () => {

    const flipCards = document.querySelectorAll("[data-flip-card]");

    if (!flipCards.length) {
        return;
    }

    const toggleCard = (card) => {

        const isFlipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(isFlipped));

    };

    flipCards.forEach((card) => {

        card.addEventListener("click", () => {
            toggleCard(card);
        });

        card.addEventListener("keydown", (event) => {

            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            toggleCard(card);

        });

    });

};

const initEvolutionAutoScroll = () => {

    const timeline = document.querySelector("#evolution .timeline");

    if (!timeline) {
        return;
    }

    const desktopQuery = window.matchMedia("(min-width: 1101px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let animationFrameId = null;
    let direction = 1;
    let lastTimestamp = 0;
    let interactionTimeoutId = null;
    let isUserPaused = false;
    let bootAttempts = 0;
    let bootTimeoutId = null;

    const speed = 0.18;

    const hasOverflow = () => timeline.scrollWidth - timeline.clientWidth > 12;

    const stop = () => {

        if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        timeline.classList.remove("timeline-auto-scroll");

    };

    const clearBootTimeout = () => {

        if (!bootTimeoutId) {
            return;
        }

        window.clearTimeout(bootTimeoutId);
        bootTimeoutId = null;

    };

    const step = (timestamp) => {

        if (!animationFrameId) {
            return;
        }

        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }

        const delta = Math.min(32, timestamp - lastTimestamp);
        lastTimestamp = timestamp;

        const maxScrollLeft = timeline.scrollWidth - timeline.clientWidth;

        if (maxScrollLeft <= 0) {
            stop();
            return;
        }

        let nextScrollLeft = timeline.scrollLeft + direction * speed * delta;

        if (nextScrollLeft >= maxScrollLeft) {
            nextScrollLeft = maxScrollLeft;
            direction = -1;
        } else if (nextScrollLeft <= 0) {
            nextScrollLeft = 0;
            direction = 1;
        }

        timeline.scrollLeft = nextScrollLeft;
        animationFrameId = window.requestAnimationFrame(step);

    };

    const start = () => {

        if (animationFrameId || isUserPaused) {
            return;
        }

        if (!desktopQuery.matches || reducedMotionQuery.matches || !hasOverflow()) {
            stop();
            return;
        }

        timeline.classList.add("timeline-auto-scroll");
        lastTimestamp = 0;
        animationFrameId = window.requestAnimationFrame(step);

    };

    const bootstrap = () => {

        if (animationFrameId) {
            return;
        }

        if (desktopQuery.matches && !reducedMotionQuery.matches && hasOverflow()) {
            bootAttempts = 0;
            clearBootTimeout();
            start();
            return;
        }

        if (bootAttempts >= 12) {
            clearBootTimeout();
            return;
        }

        bootAttempts += 1;
        clearBootTimeout();
        bootTimeoutId = window.setTimeout(bootstrap, 250);

    };

    const pauseForInteraction = () => {

        isUserPaused = true;
        stop();

        if (interactionTimeoutId) {
            window.clearTimeout(interactionTimeoutId);
        }

        interactionTimeoutId = window.setTimeout(() => {
            isUserPaused = false;
            start();
        }, 2400);

    };

    const pause = () => {
        isUserPaused = true;
        stop();
    };

    const resume = () => {
        isUserPaused = false;
        start();
    };

    timeline.addEventListener("mouseenter", pause);
    timeline.addEventListener("mouseleave", resume);

    timeline.addEventListener("wheel", pauseForInteraction, { passive: true });
    timeline.addEventListener("pointerdown", pauseForInteraction);
    timeline.addEventListener("touchstart", pauseForInteraction, { passive: true });

    timeline.addEventListener("focusin", pause);
    timeline.addEventListener("focusout", resume);

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stop();
            return;
        }

        if (!isUserPaused) {
            start();
        }

    });

    const refreshOnLayoutChange = () => {

        if (timeline.scrollLeft >= timeline.scrollWidth - timeline.clientWidth - 1) {
            direction = -1;
        }

        start();
        bootstrap();

    };

    const bindMediaQueryChange = (query, handler) => {

        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", handler);
            return;
        }

        if (typeof query.addListener === "function") {
            query.addListener(handler);
        }

    };

    bindMediaQueryChange(desktopQuery, refreshOnLayoutChange);
    bindMediaQueryChange(reducedMotionQuery, refreshOnLayoutChange);
    window.addEventListener("resize", refreshOnLayoutChange, { passive: true });

    if (window.ResizeObserver) {

        const resizeObserver = new window.ResizeObserver(() => {
            refreshOnLayoutChange();
        });

        resizeObserver.observe(timeline);

    }

    if (document.fonts && typeof document.fonts.ready?.then === "function") {
        document.fonts.ready.then(() => {
            refreshOnLayoutChange();
        }).catch(() => {
            // Ignore font loading failures.
        });
    }

    window.addEventListener("load", refreshOnLayoutChange, { once: true });

    start();
    bootstrap();

};

window.addEventListener(

    "DOMContentLoaded",

    async ()=>{

        mountSharedNavbar();

        initThemeToggle();
        initImpactCardFlip();
        initEvolutionAutoScroll();
        await initProjectsGallery();

        try {
            await App.init();
        } catch (error) {
            console.error("App initialization failed:", error);
        }

    }

);