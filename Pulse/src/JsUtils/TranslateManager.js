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
            const response = await fetch("../datas/languages.json");
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
        document.getElementById("export_to_html_text_sidebar").innerText = this.data["sidebar"]["export_to_html"][this.choosen_language];
        document.getElementById("export_to_pdf_text_sidebar").innerText = this.data["sidebar"]["export_to_pdf"][this.choosen_language];
        document.getElementById("code_text_sidebar").innerText = this.data["sidebar"]["code"][this.choosen_language];
        document.getElementById("settings_text_sidebar").innerText = this.data["sidebar"]["settings"][this.choosen_language];
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
        document.getElementById("recent_file_text").innerText = this.data["home"]["recent_files"][this.choosen_language];
    }
}