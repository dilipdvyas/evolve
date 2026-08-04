import { DataService } from "../services/data-service.js";

const PAGE_SELECTOR = "[data-projects-page='true']";

const formatDateLabel = (value) => {

    if (!value) {
        return "NA";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric"
    });

};

const normalize = (value) => String(value || "").trim();

const toSafeId = (value) => normalize(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "all";

const getUniqueValues = (items, mapValue) => {

    const values = new Set();

    items.forEach((item) => {

        const mapped = mapValue(item);

        if (Array.isArray(mapped)) {

            mapped.forEach((entry) => {
                const value = normalize(entry);

                if (value) {
                    values.add(value);
                }
            });

            return;
        }

        const value = normalize(mapped);

        if (value) {
            values.add(value);
        }

    });

    return Array.from(values).sort((a, b) => a.localeCompare(b));

};

const createProjectCard = (project) => {

    const technologies = Array.isArray(project.technology) ? project.technology : [];
    const hasLink = project.link && project.link.trim();
    const cardTag = hasLink ? `a` : `article`;
    const cardAttrs = hasLink
        ? `class="project-card project-card--linked" href="${project.link}" aria-label="Read more about ${project.projectName}"`
        : `class="project-card"`;

    return `
<${cardTag} ${cardAttrs}>

    <div class="project-card-head">

        <span class="project-sr">${project.srNo || "-"}</span>

        <span class="project-time">${formatDateLabel(project.from)} - ${formatDateLabel(project.to)}</span>

    </div>

    <h3>${project.projectName || "Untitled Project"}</h3>

    <p class="project-company">${project.organization || "Unknown Organization"}</p>

    <p class="project-domain">${project.domain || "Domain Not Specified"}</p>

    <div class="project-tech-wrap">
        ${technologies.length > 0
            ? technologies.map((tech) => `<span class="project-tech">${tech}</span>`).join("")
            : '<span class="project-tech">Legacy Stack</span>'}
    </div>

</${cardTag}>
    `;

};

const filterProjects = (projects, state) => {

    return projects.filter((project) => {

        const matchesCompany = state.company === "all"
            ? true
            : normalize(project.organization) === state.company;

        if (!matchesCompany) {
            return false;
        }

        if (state.technology === "all") {
            return true;
        }

        const stack = Array.isArray(project.technology)
            ? project.technology.map((item) => normalize(item).toLowerCase())
            : [];

        return stack.includes(state.technology.toLowerCase());

    });

};

const buildFilterButtons = (values, activeValue, group) => {

    const buttons = [`
        <button class="project-filter-btn ${activeValue === "all" ? "is-active" : ""}" type="button" data-filter-group="${group}" data-filter-value="all" aria-pressed="${activeValue === "all"}">
            All
        </button>
    `];

    values.forEach((value) => {

        const normalizedValue = normalize(value);
        const isActive = activeValue === normalizedValue;

        buttons.push(`
            <button class="project-filter-btn ${isActive ? "is-active" : ""}" type="button" data-filter-group="${group}" data-filter-value="${normalizedValue}" aria-pressed="${isActive}" id="${group}-${toSafeId(normalizedValue)}">
                ${normalizedValue}
            </button>
        `);

    });

    return buttons.join("");

};

const initCursorSpotlight = (section) => {

    if (!window.matchMedia("(pointer:fine)").matches) {
        return;
    }

    let frameId = null;
    let lastX = 0;
    let lastY = 0;

    const apply = () => {

        section.style.setProperty("--cursor-x", `${lastX}px`);
        section.style.setProperty("--cursor-y", `${lastY}px`);
        frameId = null;

    };

    section.addEventListener("mousemove", (event) => {

        const bounds = section.getBoundingClientRect();
        lastX = event.clientX - bounds.left;
        lastY = event.clientY - bounds.top;

        if (frameId) {
            return;
        }

        frameId = window.requestAnimationFrame(apply);

    });

    section.addEventListener("mouseenter", () => {
        section.classList.add("is-pointer-active");
    });

    section.addEventListener("mouseleave", () => {
        section.classList.remove("is-pointer-active");
    });

};

export const initProjectsGallery = async () => {

    const page = document.querySelector(PAGE_SELECTOR);

    if (!page) {
        return;
    }

    const companyTarget = page.querySelector("[data-filter-target='company']");
    const technologyTarget = page.querySelector("[data-filter-target='technology']");
    const countTarget = page.querySelector("[data-projects-count]");
    const listTarget = page.querySelector("[data-projects-list]");

    if (!companyTarget || !technologyTarget || !countTarget || !listTarget) {
        return;
    }

    const payload = await DataService.load("projects");
    const projects = Array.isArray(payload?.projects) ? payload.projects : [];

    const companies = getUniqueValues(projects, (project) => project.organization);
    const technologies = getUniqueValues(projects, (project) => project.technology || []);

    const state = {
        company: "all",
        technology: "all"
    };

    const render = () => {

        companyTarget.innerHTML = buildFilterButtons(companies, state.company, "company");
        technologyTarget.innerHTML = buildFilterButtons(technologies, state.technology, "technology");

        const visible = filterProjects(projects, state);

        countTarget.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;

        if (visible.length === 0) {

            listTarget.innerHTML = `
                <article class="project-empty">
                    <h3>No projects match this filter combination.</h3>
                    <p>Try selecting All in either Company or Technology to broaden the results.</p>
                </article>
            `;

            return;
        }

        listTarget.innerHTML = visible.map(createProjectCard).join("");

    };

    page.addEventListener("click", (event) => {

        const button = event.target.closest(".project-filter-btn");

        if (!button) {
            return;
        }

        const group = button.getAttribute("data-filter-group");
        const value = normalize(button.getAttribute("data-filter-value"));

        if (group === "company") {
            state.company = value || "all";

            if (state.technology !== "all" && filterProjects(projects, state).length === 0) {
                state.technology = "all";
            }
        }

        if (group === "technology") {
            state.technology = value || "all";

            if (state.company !== "all" && filterProjects(projects, state).length === 0) {
                state.company = "all";
            }
        }

        render();

    });

    initCursorSpotlight(page);
    render();

};
