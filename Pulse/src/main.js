const { invoke } = window.__TAURI__.core;
import ColorMode from "./JsUtils/ColorMode.js";
import JsonManager from "./JsUtils/JsonManager.js";

const jsonManager = new JsonManager("datas/data.json");
const recent_files_container = document.getElementById("recent_files_container");
const colorMode = new ColorMode("index");

let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark
let toggleColorMode;

async function syncVersion(){
  const version = await invoke("get_version");
  document.getElementById("version").innerText = version;
}
syncVersion();

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

// Ajout des fichiers récents
async function loadRecentFiles() {
  const titles = await jsonManager.getRecentFileTitles();
  titles.forEach(title => {
    const new_recent_file = document.createElement("div");
    const bgClass = toggleColorMode === 0 ? "bg-gray-700" : "bg-gray-200";
    new_recent_file.setAttribute("class", `recent-file p-3 ${bgClass} rounded-lg`);
    new_recent_file.innerText = title;
    recent_files_container.appendChild(new_recent_file);
  });
}

// Événements DOM
window.addEventListener("DOMContentLoaded", async () => {
  await applyTheme();
  await loadRecentFiles();

  document.getElementById("openFileButton").addEventListener("click", selectFile);

  document.getElementById("exportToHtml").addEventListener("click", () => {
    window.location.href = "html/htmlExport.html";
  });

  document.getElementById("settings").addEventListener("click", () => {
    window.location.href = "html/settings.html";
  });
});
