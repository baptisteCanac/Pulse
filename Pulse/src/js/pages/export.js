const { invoke } = window.__TAURI__.core;
import TranslateManager from "../lib/TranslateManager.js";
import ColorManager from "../lib/ColorManager.js";

let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark

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

// Fonction principale qui applique le thème
async function updateTheme() {
  try {
    theme = parseInt(await invoke("get_theme"), 10);
    const colorManager = new ColorManager();

    // Application du thème
    if (theme === 3) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        console.log("dark");
      } else {
        console.log("light");
      }
    }else{
        colorManager.sidebar(theme);
    }

  } catch (err) {
    console.error("Erreur lors de la mise à jour du thème :", err);
  }
}

redirections();
translate();
updateTheme();