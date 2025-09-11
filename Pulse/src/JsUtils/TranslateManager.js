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
}