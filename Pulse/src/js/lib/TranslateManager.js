const { invoke } = window.__TAURI__.core;

export default class TranslateManager {
    constructor() {
        this.data = null;
        this.choosen_language = null;
    }

    async init() {
        this.data = await this.getData();
        this.choosen_language = this.data["choosen_language"];

        return this; // retourne l'objet une fois prêt
    }
    
    translateDict(toTranslate, pageElement=null){
        /* 
        Translate an entire dictionnary using this method using this format
        {
        "name of the hmtl element": ["name of the page element", "name of the element in TranslateManager"]
        }
        */
        if (Array.isArray(toTranslate)){
            toTranslate.forEach(element => {
                this.translate(element, pageElement, element);
            });
        }else{
            if (pageElement == null){
                for (let key in toTranslate){
                    this.translate(key, toTranslate[key][0], toTranslate[key][1]);
                };
            }else{
                for (let key in toTranslate){
                    this.translate(key, pageElement, toTranslate[key]);
                }
            }
        }
    }

    translate(nameTextContainer, nameTranslationContainer, nameTranslationCategory){
        /*
        With this function you don't need to use document.get...
        */
        document.getElementById(nameTextContainer).innerText = this.data[nameTranslationContainer][nameTranslationCategory][this.choosen_language];
    }

    async getData() {
        try {
            const response = await fetch("../../datas/languages.json");
            if (!response.ok) throw new Error("Erreur réseau");
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    translateSidebar() {
        const toTranslate = {
            "home_text_sidebar": "home",
            "export_text_sidebar": "export",
            "code_text_sidebar": "code",
            "settings_text_sidebar": "settings",
            "version_text": "version"
        };

        this.translateDict(toTranslate, "sidebar");

        async function syncVersion(){
            const version = await invoke("get_version");
            document.getElementById("version").innerText = version;
        }
        syncVersion();
    }

    translateSettings() {
        const keys = [
            "title",
            "theme_title",
            "auto_mode",
            "light_mode",
            "dark_mode",
            "language_title",
            "diagrams_and_code_title",
            "languages_highlighted",
            "shortcuts_title",
            "open_overlay",
            "open_overlay_subtitle",
            "go_home",
            "go_home_shortcut",
            "default_values",
            "ergonomic_settings_title",
            "close_sidebar"
        ];

        keys.forEach(key => {
            const element = document.getElementById(key);
            if (element && this.data.settings[key] && this.data.settings[key][this.choosen_language]) {
                element.innerText = this.data.settings[key][this.choosen_language];
            }
        });
        
        document.getElementById("saveBtn").innerText = this.data["settings"]["save"][this.choosen_language];
    }

    translateHome(){
        document.getElementById("openFileButton").innerText = this.data["home"]["open_a_file"][this.choosen_language];
    }

    translateExport(){
        const toTranslate = [
            "title",
            "formats",
            "loop",
            "protect",
            "size",
            "cta",
            "chooseFile",
            "popupTitle",
            "popupSubtitle",
            "closePopupButton",
            "goBackButton",
            "exportSettings"
        ];

        this.translateDict(toTranslate, "export");
    }
}