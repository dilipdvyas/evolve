export class ComponentManager{

    constructor(){

        this.components=[];

    }

    register(component){

        this.components.push(component);

    }

    async init(){

        for(const component of this.components){

            await component.init();

        }

    }

}