import { Observer } from "./observer.js";

/**
 * ============================================================
 * Animation Manager
 * ============================================================
 */

export class Animation {

    static revealAll(elements) {

        elements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }

    static init() {

        const targets = document.querySelectorAll("[data-animate], .reveal");
        let visibleCount = 0;

        const markVisible = (element) => {
            if (!element.classList.contains("is-visible")) {
                element.classList.add("is-visible");
                visibleCount += 1;
            }
        };

        if (!targets.length) {
            return;
        }

        document.documentElement.classList.add("has-animations");

        if (!("IntersectionObserver" in window)) {
            Animation.revealAll(targets);
            return;
        }

        try {
            const observer = Observer.create((entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        markVisible(entry.target);

                        observer.unobserve(entry.target);

                    }

                });

            });

            // Wait one frame so hidden state is applied before intersection callbacks.
            window.requestAnimationFrame(() => {
                targets.forEach((element) => {
                    observer.observe(element);
                });
            });

            // Fail-safe only if observer never reveals even one element.
            window.setTimeout(() => {
                if (visibleCount === 0) {
                    Animation.revealAll(targets);
                }
            }, 2000);
        } catch (_error) {
            Animation.revealAll(targets);
        }

    }

}