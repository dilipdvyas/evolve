/**
 * ============================================================
 * Base Component
 * ============================================================
 */

export class BaseComponent {

    constructor(selector){

        this.selector = selector;

        this.element = document.querySelector(selector);

    }

    async init(){

        if(!this.element){

            console.warn(

                `${this.constructor.name} : Target not found`

            );

            return;

        }

        await this.render();

        this.bindEvents();

    }

    async render(){

        throw new Error(

            "render() must be implemented."

        );

    }

    bindEvents(){}

    destroy(){}

}