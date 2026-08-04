import { DataService } from "../services/data-service.js";
import { ComponentManager } from "./component-manager.js";

import { Navbar } from "../components/navbar.js";
import { Hero } from "../components/hero.js";
import { Footer } from "../components/footer.js";

import { Animation } from "../utils/animation.js";

export class App {

    static async init() {

        // Load all JSON data
        await Promise.all([

            DataService.load("site"),
            DataService.load("social")

        ]);

        // Create Component Manager
        const manager = new ComponentManager();

        // Register Components
        manager.register(new Navbar());
        manager.register(new Hero());
        manager.register(new Footer());

        // Initialize Components
        await manager.init();

        // Initialize Animations
        Animation.init();

        document.dispatchEvent(
            new CustomEvent("app-ready")
        );

    }

}