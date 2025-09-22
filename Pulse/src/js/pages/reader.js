const { invoke } = window.__TAURI__.core;

import MarkdownParser from "../lib/MarkdownParser.js";
import ColorMode from "../lib/ColorMode.js";

async function codeTraitement(){
    const markdownParser = new MarkdownParser(invoke);
    const container = document.getElementById("container");

    let code = await invoke("get_code");
    let presentationPath = await invoke("get_presentation_path");
    code = await markdownParser.parseAll(code, presentationPath);
    
    container.innerHTML = code;
    
    // Rendre les formules LaTeX après insertion
    markdownParser.renderMathElements(); // ← Ajouter cette ligne
}

codeTraitement();

function redirections(){
    const temp = document.querySelector("app-sidebar");

    temp.addEventListener("rendered", () => {
        document.getElementById("home").addEventListener("click", () => {
            window.location.href = "../../index.html";
        });
        document.getElementById("export").addEventListener("click", () => {
            window.location.href = "../../html/export.html";
        });
        document.getElementById("code").addEventListener("click", () => {
            window.location.href = "../../html/code.html";
        });
        document.getElementById("settings").addEventListener("click", () => {
            window.location.href = "../../html/settings.html";
        });
    });
}
redirections();