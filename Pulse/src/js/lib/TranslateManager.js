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
        document.getElementById("home_text_sidebar").innerText = this.data["sidebar"]["home"][this.choosen_language];
        document.getElementById("export_text_sidebar").innerText = this.data["sidebar"]["export"][this.choosen_language];
        document.getElementById("code_text_sidebar").innerText = this.data["sidebar"]["code"][this.choosen_language];
        document.getElementById("settings_text_sidebar").innerText = this.data["sidebar"]["settings"][this.choosen_language];

        document.getElementById("version_text").innerHTML = this.data["sidebar"]["version"][this.choosen_language];

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
        document.getElementById("title").innerText = this.data["export"]["title"][this.choosen_language];
        document.getElementById("formats").innerText = this.data["export"]["formats"][this.choosen_language];
        document.getElementById("exportSettings").innerText = this.data["export"]["settings"][this.choosen_language];
        document.getElementById("loop").innerText = this.data["export"]["loop"][this.choosen_language];
        document.getElementById("protect").innerText = this.data["export"]["protect"][this.choosen_language];
        document.getElementById("size").innerText = this.data["export"]["size"][this.choosen_language];
        document.getElementById("cta").innerText = this.data["export"]["cta"][this.choosen_language];
        document.getElementById("chooseFile").innerText = this.data["export"]["choose_a_file"][this.choosen_language];
        document.getElementById("popupTitle").innerText = this.data["export"]["popup_title"][this.choosen_language];
        document.getElementById("popupSubtitle").innerText = this.data["export"]["popup_subtitle"][this.choosen_language];
        document.getElementById("closePopupButton").innerText = this.data["export"]["understand_popup"][this.choosen_language];
        document.getElementById("goBackButton").innerText = this.data["export"]["go_back_popup"][this.choosen_language];
    }
}