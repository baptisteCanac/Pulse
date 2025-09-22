import JsonManager from "./JsonManager.js";

export default class HeadManager{
    constructor(){
        this.config;
        this.head = document.head;
    }

    createElement(elementName, attributes){
        const element = document.createElement(elementName);
        if (Object.keys(attributes).length != 0){
            for (const key in attributes){
                element.setAttribute(key, attributes[key]);
            }
        }
        return element;
    }

    async init(){
        /*
        Load global config
        */
        this.config = await new JsonManager("../../datas/config.json").getConfig();
        this.config = this.config.headManager;

        const global = this.config.global;
        const tags = global.tags;
        const attributes = global.attributes;

        for (const tag in tags){
            const element = this.createElement(tags[tag], attributes[tag]);
            this.head.prepend(element);
        }
    }
}