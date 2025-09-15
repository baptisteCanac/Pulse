const { invoke } = window.__TAURI__.core;
import TranslateManager from "../lib/TranslateManager.js";

function redirections(){
    const temp = document.querySelector("app-sidebar");

    temp.addEventListener("rendered", () => {
        document.getElementById("home").addEventListener("click", () => {
            window.location.href = "../../index.html";
        });
        document.getElementById("code").addEventListener("click", () => {
            window.location.href = "../../html/code.html";
        });
        document.getElementById("settings").addEventListener("click", () => {
            window.location.href = "../../html/settings.html";
        });
    });
}

async function translate(){
    const translateManager = await new TranslateManager().init();
    translateManager.translateSidebar();
}

redirections();
translate();