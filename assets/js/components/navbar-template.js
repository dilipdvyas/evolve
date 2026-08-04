const getNormalizedPath = () => {

    const rawPath = window.location.pathname || "/";

    if (!rawPath) {
        return "/";
    }

    return rawPath.endsWith("/") ? `${rawPath}index.html` : rawPath;

};

const isRootPage = () => {

    const normalizedPath = getNormalizedPath().toLowerCase();

    return normalizedPath.endsWith("/index.html");

};

const getPrefix = () => {

    const styleLink = document.querySelector('link[href$="assets/css/main.css"]');

    if (styleLink) {

        const href = styleLink.getAttribute("href") || "assets/css/main.css";
        const marker = "assets/css/main.css";

        if (href.endsWith(marker)) {
            return href.slice(0, -marker.length);
        }

    }

    const normalizedPath = getNormalizedPath();
    const segments = normalizedPath.split("/").filter(Boolean);

    if (segments.length <= 1) {
        return "";
    }

    return "../".repeat(segments.length - 1);

};

const buildLink = (sectionId) => {

    if (isRootPage()) {
        return `#${sectionId}`;
    }

    return `${getPrefix()}index.html#${sectionId}`;

};

const buildSharedNavbarMarkup = () => {

    const prefix = getPrefix();

    const heroLink = isRootPage() ? "#hero" : `${prefix}index.html#hero`;
    const workHistoryLink = `${prefix}work-history.html`;
    const journeyLink = `${prefix}journey.html`;
    const blogLink = `${prefix}blog.html`;
    const projectsPageLink = `${prefix}projects.html`;

    return `
        <nav class="navbar">

            <div class="container navbar-container">

            <!-- Brand -->

            <a href="${heroLink}" class="logo">

                <span class="logo-symbol">
                    <img src="${prefix}assets/images/dv.png"
                            alt="Dilip Vyas">
                </span>

                <span class="logo-text">

                <span class="logo-title">
                    Dilip Vyas
                </span>

                <span class="logo-subtitle">
                    Technology changes. Principles endure.
                </span>

                </span>

            </a>

            <!-- Desktop Navigation -->

            <ul class="nav-menu">

<li class="nav-item nav-item--dropdown">

    <button class="nav-link nav-dropdown-toggle" type="button" aria-expanded="false">
        About
        <span class="nav-arrow" aria-hidden="true"></span>
    </button>

    <ul class="nav-submenu" aria-label="About">

        <li><a href="${buildLink("evolution")}" class="nav-sublink" data-track-section="true">Journey</a></li>

        <li><a href="${journeyLink}" class="nav-sublink">Full Journey</a></li>

        <li><a href="${workHistoryLink}" class="nav-sublink">Work History</a></li>

    </ul>

</li>

<li class="nav-item"><a href="${buildLink("expertise")}" class="nav-link" data-track-section="true">Expertise</a></li>

<li class="nav-item"><a href="${projectsPageLink}" class="nav-link">Projects</a></li>

<li class="nav-item nav-item--dropdown">

    <button class="nav-link nav-dropdown-toggle" type="button" aria-expanded="false">
        Insights
        <span class="nav-arrow" aria-hidden="true"></span>
    </button>

    <ul class="nav-submenu" aria-label="Insights">

        <li><a href="${buildLink("insights")}" class="nav-sublink" data-track-section="true">Latest Insights</a></li>

        <li><a href="${blogLink}" class="nav-sublink">Blog</a></li>

    </ul>

</li>

<li class="nav-item"><a href="${buildLink("contact")}" class="nav-link" data-track-section="true">Contact</a></li>

            </ul>

            <button class="nav-theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false">

                <span class="theme-icon" aria-hidden="true">◐</span>

            </button>

            <!-- Mobile -->

            <button class="nav-toggle" aria-label="Open navigation" aria-expanded="false">

                <span></span>

            </button>

            </div>

        </nav>
    `;

};

export const mountSharedNavbar = () => {

    let header = document.querySelector(".site-header");

    if (!header) {

        header = document.createElement("header");
        header.className = "site-header";

        const main = document.querySelector("main");

        if (main && main.parentNode) {
            main.parentNode.insertBefore(header, main);
        } else {
            document.body.prepend(header);
        }

    }

    header.innerHTML = buildSharedNavbarMarkup();

};
