export class Hero {

    constructor() {

        this.orbit = document.querySelector("[data-orbit]");
        this.orbitStage = document.querySelector(".orbit-stage");
        this.careerYears = document.getElementById("careerYears");
        this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    }

    async init() {

        this.updateCareerYears();

        if (this.prefersReducedMotion) {
            return;
        }

        this.bindOrbitParallax();

    }

    updateCareerYears() {

        if (!this.careerYears) {
            return;
        }

        const startYear = 1993;
        const years = new Date().getFullYear() - startYear;

        this.careerYears.textContent = `${years}+`;

    }

    bindOrbitParallax() {

        if (!this.orbit || !this.orbitStage) {
            return;
        }

        window.addEventListener("mousemove", (event) => {

            const x = (event.clientX / window.innerWidth - 0.5) * 14;
            const y = (event.clientY / window.innerHeight - 0.5) * 14;

            this.orbit.style.setProperty("--orbit-x", `${x}px`);
            this.orbit.style.setProperty("--orbit-y", `${y}px`);

        }, { passive: true });

    }

}
