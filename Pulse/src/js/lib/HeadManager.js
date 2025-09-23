import JsonManager from "./JsonManager.js";

export default class HeadManager {
    constructor() {
        this.config = {};
        this.head = document.head;
    }

    createElement(elementName, attributes = {}) {
        const element = document.createElement(elementName);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    async init() {
        const fullConfig = await new JsonManager("../../datas/config.json").getConfig();
        this.config = fullConfig.headManager; // mise à jour définitive

        const global = this.config.global;
        const tags = global.tags;
        const attributes = global.attributes;

        for (const tag in tags) {
            const element = this.createElement(tags[tag], attributes[tag]);
            this.head.appendChild(element);
        }

        // set up title
        document.title = this.config.title;
    }

    async setHead(sectionName) {
        await this.init();

        const container = this.config[sectionName];
        const tags = container.tags;
        const attributes = container.attributes;

        for (const tag in tags) {
            const element = this.createElement(tags[tag], attributes[tag]);
            this.head.appendChild(element);
        }
    }
}