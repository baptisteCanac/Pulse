const { invoke } = window.__TAURI__.core;
import ColorMode from "./js/lib/ColorMode.js";
import JsonManager from "./js/lib/JsonManager.js";
import TranslateManager from "./js/lib/TranslateManager.js";
import RedirectionManager from "./js/lib/RedirectionManager.js";

const redirectionManager = new RedirectionManager(
  "#",
  "html/export.html",
  "html/code.html",
  "html/settings.html"
);
const jsonManager = new JsonManager("datas/data.json");
const recent_files_container = document.getElementById("recent_files_container");
const colorMode = new ColorMode("index");

let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark
let toggleColorMode;

// Fonction pour appliquer le thème actuel
async function applyTheme() {
  try {
    theme = parseInt(await invoke("get_theme"), 10);

    // Nettoyage des classes générales
    document.body.classList.remove("settings-light", "settings-dark");

    // Appliquer le thème
    if (theme === 1) {
      colorMode.lightMode();
      toggleColorMode = 1;
    } else if (theme === 2) {
      colorMode.darkMode();
      toggleColorMode = 0;
    } else {
      // Auto : détecter le système
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        colorMode.darkMode();
        toggleColorMode = 0;
      } else {
        colorMode.lightMode();
        toggleColorMode = 1;
      }
    }

    updateThemeButtons();
  } catch (err) {
    console.error("Erreur lors de l'application du thème :", err);
  }
}

// Boutons du sélecteur de thème (si jamais on en ajoute)
const buttons = document.querySelectorAll("#themeSection .radio-button");
function updateThemeButtons() {
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === theme);
  });
}

// Sélection d’un fichier
async function selectFile() {
  const selectedfilePath = await invoke("select_file", { scriptPath: "../src/scripts/pick_file.py" });
  console.log(await invoke("new_recent_file", { newRecentFilePath: selectedfilePath }));
  window.location.href = "html/presenter.html";
}

// Événements DOM
window.addEventListener("DOMContentLoaded", async () => {
  await applyTheme();

  document.getElementById("openFileButton").addEventListener("click", selectFile);

  redirectionManager.initRedirections();
});

async function translate(){
  const translateManager = await new TranslateManager().init();
  translateManager.translateSidebar();
  translateManager.translateHome();
}

translate();