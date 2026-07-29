export class Navbar {

	constructor() {

		this.navbar = document.querySelector(".navbar");
		this.toggle = document.querySelector(".nav-toggle");
		this.menu = document.querySelector(".nav-menu");
		this.links = Array.from(document.querySelectorAll("[data-track-section='true'][href^='#']"));
		this.dropdownItems = Array.from(document.querySelectorAll(".nav-item--dropdown"));
		this.dropdownToggles = Array.from(document.querySelectorAll(".nav-dropdown-toggle"));
		this.sections = this.links
			.map((link) => document.querySelector(link.getAttribute("href")))
			.filter(Boolean);

	}

	async init() {

		if (!this.navbar) {
			return;
		}

		this.bindScrollState();
		this.bindMobileToggle();
		this.bindDropdownToggles();
		this.bindActiveLinkState();

	}

	bindScrollState() {

		const applyState = () => {

			this.navbar.classList.toggle("scrolled", window.scrollY > 12);

		};

		applyState();
		window.addEventListener("scroll", applyState, { passive: true });

	}

	bindMobileToggle() {

		if (!this.toggle || !this.menu) {
			return;
		}

		this.navbar.classList.add("js-nav");
		this.toggle.setAttribute("aria-expanded", "false");

		this.toggle.addEventListener("click", () => {

			const isOpen = !this.menu.classList.contains("is-open");
			this.setMenuState(isOpen);

		});

		this.menu.addEventListener("click", (event) => {

			const clickedLink = event.target.closest(".nav-link[href^='#'], .nav-sublink");

			if (!clickedLink) {
				return;
			}

			this.setMenuState(false);

		});

		window.addEventListener("resize", () => {

			if (window.innerWidth > 992) {
				this.setMenuState(false);
				this.closeAllDropdowns();
			}

		});

	}

	bindDropdownToggles() {

		if (this.dropdownToggles.length === 0) {
			return;
		}

		this.dropdownToggles.forEach((toggle) => {

			toggle.addEventListener("click", (event) => {

				if (window.innerWidth > 992) {
					return;
				}

				event.preventDefault();

				const item = toggle.closest(".nav-item--dropdown");
				const willOpen = item ? !item.classList.contains("is-open") : false;

				this.closeAllDropdowns();

				if (item && willOpen) {
					item.classList.add("is-open");
					toggle.setAttribute("aria-expanded", "true");
				}

			});

		});

		document.addEventListener("click", (event) => {

			if (window.innerWidth <= 992) {
				return;
			}

			const insideDropdown = event.target.closest(".nav-item--dropdown");

			if (!insideDropdown) {
				this.closeAllDropdowns();
			}

		});

	}

	closeAllDropdowns() {

		this.dropdownItems.forEach((item) => item.classList.remove("is-open"));
		this.dropdownToggles.forEach((toggle) => toggle.setAttribute("aria-expanded", "false"));

	}

	setMenuState(isOpen) {

		this.menu.classList.toggle("is-open", isOpen);
		this.toggle.setAttribute("aria-expanded", String(isOpen));

		if (!isOpen) {
			this.closeAllDropdowns();
		}

	}

	bindActiveLinkState() {

		if (this.sections.length === 0 || this.links.length === 0) {
			return;
		}

		const updateActiveLink = () => {

			const marker = window.scrollY + this.navbar.offsetHeight + 40;
			let activeSection = this.sections[0];

			this.sections.forEach((section) => {

				if (section.offsetTop <= marker) {
					activeSection = section;
				}

			});

			this.links.forEach((link) => {

				const target = link.getAttribute("href");
				const isActive = target === `#${activeSection.id}`;
				link.classList.toggle("active", isActive);

			});

		};

		updateActiveLink();
		window.addEventListener("scroll", updateActiveLink, { passive: true });

	}

}
