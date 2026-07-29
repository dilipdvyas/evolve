import { CONFIG } from "../core/config.js";

/**
 * ============================================================
 * Intersection Observer
 * ============================================================
 */

export class Observer {

    static create(callback) {

        return new IntersectionObserver(

            callback,

            {

                threshold: CONFIG.OBSERVER_THRESHOLD,

                rootMargin: CONFIG.OBSERVER_ROOT_MARGIN

            }

        );

    }

}