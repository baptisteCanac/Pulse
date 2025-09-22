export default class HeadManager{
    constructor(){
        self.head = document.querySelector("head");
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

    init(){
        /*
        Load global config
        */
        const meta = this.createElement("meta", {'charset': 'UTF-8'});
        document.head.prepend(meta);
    }
}