/**
 * ============================================================
 * EVOLVE Enterprise Portfolio
 * Footer Component
 * ============================================================
 */

import { BaseComponent } from "./base-component.js";
import { DataService } from "../services/data-service.js";

export class Footer extends BaseComponent {

    constructor() {

        super("#footer");

    }

    async render() {

        const site = DataService.get("site");
        const social = DataService.get("social") || {};

        const year = new Date().getFullYear();

        this.element.innerHTML = `

<footer class="footer">

    <a href="#hero" class="back-to-top">

        ↑

    </a>

    <div class="container footer-container">

        <div class="footer-brand">

            <div class="footer-logo">

                <div class="footer-logo-symbol">

                    DV

                </div>

                <div class="footer-logo-text">

                    <div class="footer-logo-title">

                        ${site.name}

                    </div>

                    <div class="footer-logo-subtitle">

                        ${site.title}

                    </div>

                </div>

            </div>

            <p class="footer-description">

                ${site.description || site.tagline}

            </p>

            <div class="footer-social">

                ${this.socialIcon(social.linkedin, "LinkedIn", "linkedin")}

                ${this.socialIcon(social.github, "GitHub", "github")}

                ${this.socialIcon(social.facebook, "Facebook", "facebook")}

                ${this.socialIcon(social.instagram, "Instagram", "instagram")}

                ${this.socialIcon(social.twitter || social.x, "X", "x")}

                ${this.socialIcon(social.email ? `mailto:${social.email}` : "", "Email", "email")}

            </div>

        </div>

        <div class="footer-column">

            <h4>Explore</h4>

            <div class="footer-links">

                <a href="#journey">Journey</a>

                <a href="#expertise">Expertise</a>

                <a href="#leadership">Leadership</a>

                <a href="#projects">Projects</a>

                <a href="#contact">Contact</a>

            </div>

        </div>

        <div class="footer-column">

            <h4>Connect</h4>

            <div class="footer-links">

                ${social.linkedin ? `<a href="${social.linkedin}" target="_blank">LinkedIn</a>` : ""}

                ${social.github ? `<a href="${social.github}" target="_blank">GitHub</a>` : ""}

                ${social.facebook ? `<a href="${this.normalizeSocialLink(social.facebook, "facebook")}" target="_blank" rel="noopener noreferrer">Facebook</a>` : ""}

                ${social.instagram ? `<a href="${this.normalizeSocialLink(social.instagram, "instagram")}" target="_blank" rel="noopener noreferrer">Instagram</a>` : ""}

                ${(social.twitter || social.x) ? `<a href="${this.normalizeSocialLink(social.twitter || social.x, "x")}" target="_blank" rel="noopener noreferrer">X (Twitter)</a>` : ""}

                ${social.website ? `<a href="${social.website}" target="_blank">Website</a>` : ""}

                ${social.email ? `<a href="mailto:${social.email}">Email</a>` : ""}

            </div>

        </div>

    </div>

    <div class="container">

        <div class="footer-bottom">

            <div class="footer-copy">

                © ${year} ${site.name}. All Rights Reserved.

            </div>

            <div class="footer-tagline">

                Technology evolves. Architecture endures.

            </div>

        </div>

    </div>

</footer>

        `;

    }

    socialIcon(link, label, network) {

        if (!link) return "";

        const href = this.normalizeSocialLink(link, network);

        return `
            <a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">

                ${this.getSocialIconMarkup(network, label)}

            </a>
        `;

    }

    normalizeSocialLink(link, network) {

        const value = String(link || "").trim();

        if (!value) {
            return "";
        }

        if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("mailto:")) {
            return value;
        }

        const id = value.replace(/^@/, "");

        if (network === "facebook") {
            return `https://www.facebook.com/${id}`;
        }

        if (network === "instagram") {
            return `https://www.instagram.com/${id}`;
        }

        if (network === "x") {
            return `https://x.com/${id}`;
        }

        return value;

    }

    getSocialIconMarkup(network, fallbackLabel) {

        const icons = {
            linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.5V20H3.1V8.5h3.84zM5 3a2.22 2.22 0 1 1 0 4.44A2.22 2.22 0 0 1 5 3zm15.9 9.76V20h-3.82v-6.56c0-1.57-.56-2.65-1.96-2.65-1.07 0-1.7.72-1.98 1.42-.1.25-.13.6-.13.96V20H9.2s.05-10.4 0-11.5H13v1.63c.5-.78 1.38-1.9 3.36-1.9 2.45 0 4.3 1.6 4.3 5.03z"/></svg>',
            github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.54 1.05 1.54 1.05.9 1.53 2.35 1.09 2.92.83.09-.66.35-1.09.63-1.34-2.22-.26-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.29.1-2.7 0 0 .84-.27 2.75 1.02A9.48 9.48 0 0 1 12 6.8c.85 0 1.72.11 2.53.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.41.2 2.45.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.83-2.35 4.66-4.58 4.92.36.31.68.92.68 1.86v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
            facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7h2.34l.35-2.73H13.5V9.53c0-.8.22-1.33 1.36-1.33h1.45V5.76c-.25-.04-1.1-.1-2.08-.1-2.06 0-3.47 1.26-3.47 3.58v2.03H8.4V14h2.36v7h2.74z"/></svg>',
            instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.25 2h9.5A5.25 5.25 0 0 1 22 7.25v9.5A5.25 5.25 0 0 1 16.75 22h-9.5A5.25 5.25 0 0 1 2 16.75v-9.5A5.25 5.25 0 0 1 7.25 2zm0 1.9A3.35 3.35 0 0 0 3.9 7.25v9.5a3.35 3.35 0 0 0 3.35 3.35h9.5a3.35 3.35 0 0 0 3.35-3.35v-9.5a3.35 3.35 0 0 0-3.35-3.35h-9.5zm9.95 1.45a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2z"/></svg>',
            x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.5 22H3.4l7.24-8.28L1 2h6.4l4.42 5.84L18.9 2zm-1.1 18h1.73L6.47 3.9H4.6L17.8 20z"/></svg>',
            email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11zm2 .3v.48l7 4.66 7-4.66V6.8a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5zm14 2.8-6.45 4.3a1 1 0 0 1-1.1 0L5 9.6v7.9c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5V9.6z"/></svg>'
        };

        return icons[network] || fallbackLabel;

    }

}