import { CONFIG } from "../core/config.js";

export class DataService {

    static cache = {};

    static async load(fileName) {

        if (this.cache[fileName]) {
            return this.cache[fileName];
        }

        try {

            const response = await fetch(
                `${CONFIG.DATA_PATH}${fileName}.json`
            );

            if (!response.ok) {

                throw new Error(
                    `Unable to load ${fileName}.json`
                );

            }

            const json = await response.json();

            this.cache[fileName] = json;

            return json;

        }

        catch (error) {

            console.error(error);

            return null;

        }

    }

    static get(fileName){

        return this.cache[fileName];

    }

}