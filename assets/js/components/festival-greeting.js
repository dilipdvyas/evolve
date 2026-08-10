import { DataService } from "../services/data-service.js";

const SESSION_STORAGE_KEY = "evolve-festival-greeting-seen";
const DEFAULT_DURATION_MS = 3500;

const isHomePage = () => {

    const { pathname } = window.location;

    return pathname === "/" || pathname.endsWith("/index.html") || pathname.endsWith("\\index.html");

};

const hasSeenGreeting = () => {

    try {
        return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    } catch (_error) {
        return false;
    }

};

const markGreetingSeen = () => {

    try {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch (_error) {
        // Ignore storage failures.
    }

};

const buildOverlay = (greeting) => {

    const overlay = document.createElement("div");

    overlay.className = "festival-greeting";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
        <div class="festival-greeting__backdrop"></div>
        <div class="festival-greeting__dialog" role="presentation">
            <div class="festival-greeting__media">
                <img
                    class="festival-greeting__image"
                    src="${greeting.imagePath}"
                    alt="${greeting.imageAlt || greeting.heading || "Festival greeting"}"
                    loading="eager"
                    decoding="async"
                >
            </div>
        </div>
    `;

    return overlay;

};

const dismissOverlay = (overlay) => {

    overlay.classList.add("is-hiding");

    const cleanup = () => {

        document.body.classList.remove("festival-greeting-active");
        overlay.remove();

    };

    overlay.addEventListener("animationend", cleanup, { once: true });
    window.setTimeout(cleanup, 500);

};

export const initFestivalGreeting = async () => {

    if (!isHomePage() || hasSeenGreeting()) {
        return;
    }

    const siteData = await DataService.load("site");
    const greeting = siteData?.festivalGreeting;

    if (!greeting?.enabled || !greeting.imagePath) {
        return;
    }

    const overlay = buildOverlay(greeting);
    const durationMs = Number(greeting.durationMs) || DEFAULT_DURATION_MS;

    document.body.appendChild(overlay);
    document.body.classList.add("festival-greeting-active");

    window.requestAnimationFrame(() => {
        overlay.classList.add("is-visible");
    });

    markGreetingSeen();

    window.setTimeout(() => {
        dismissOverlay(overlay);
    }, Math.max(2500, durationMs));

};