const { invoke } = window.__TAURI__.core;
import ColorMode from "../JsUtils/ColorMode.js";

let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark

// Fonction principale qui applique le thème
async function updateTheme() {
  try {
    theme = parseInt(await invoke("get_theme"), 10);
    const colorMode = new ColorMode();

    // Nettoyage des classes
    document.body.classList.remove("settings-light", "settings-dark");

    // Application du thème
    if (theme === 1) {
      colorMode.lightModeSettings();
    } else if (theme === 2) {
      colorMode.darkModeSettings?.(); 
      // ⬆️ Utilise darkModeSettings() si tu l'implémentes
      document.body.classList.add("settings-dark");
    } else {
      // Thème auto (par défaut, clair si OS en clair)
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        colorMode.darkModeSettings?.();
        document.body.classList.add("settings-dark");
      } else {
        colorMode.lightModeSettings();
      }
    }

    updateThemeButtons();
  } catch (err) {
    console.error("Erreur lors de la mise à jour du thème :", err);
  }
}

// Boutons du sélecteur de thème
const buttons = document.querySelectorAll("#themeSection .radio-button");

// Met à jour l'état visuel des boutons
function updateThemeButtons() {
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === theme);
  });
}

// Changement de thème depuis les boutons
window.changeTheme = async function (val) {
  try {
    await invoke("set_theme", { newTheme: val });
    theme = val;
    await updateTheme(); // ✅ Applique directement le bon thème
    console.log("Thème mis à jour !");
  } catch (err) {
    console.error("Erreur :", err);
  }
};

// Initialisation
updateTheme();

const temp = document.querySelector("app-sidebar");

temp.addEventListener("rendered", () => {
  document.getElementById("home").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});

async function update_button() {
  let data;
  try {
    const response = await fetch("../datas/languages.json");
    if (!response.ok) throw new Error("Erreur réseau");
    data = await response.json();
  } catch (err) {
    console.error(err);
    return; // quitte si erreur
  }

  document.querySelectorAll(".change_languages_radio").forEach((element, i) => {
    if (i === data["choosen_language"]) {
      element.classList.add("active");
    }
  });
}

update_button();

function showLoader() {
  const loader = document.getElementById('loader');

  if (!loader) {
    // Création du loader seulement si il n'existe pas
    const newLoader = document.createElement('div');
    newLoader.id = 'loader';
    newLoader.className = 'fixed inset-0 flex items-center justify-center bg-white z-50 hidden'; // hidden par défaut

    const spinner = document.createElement('div');
    spinner.className = 'w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin';
    newLoader.appendChild(spinner);

    document.body.appendChild(newLoader);
    newLoader.classList.remove('hidden'); // Affiche le loader
  } else {
    loader.classList.remove('hidden'); // Affiche si déjà existant
  }
}

async function change_language(element, language_id){
  showLoader();
  const test = await invoke("save_new_language", ({languageId: language_id}));
}

document.querySelectorAll(".change_languages_radio").forEach((element, i) => {
  element.addEventListener("click", (event) => {
    change_language(event.currentTarget, i);
  });
})

async function updateTexts(){
    let data;
    try {
      const response = await fetch("../datas/languages.json");
      if (!response.ok) throw new Error("Erreur réseau");
      data = await response.json();
    } catch (err) {
      console.error(err);
      return; // quitte si erreur
    }

    let choosen_language = data["choosen_language"];

    // update the texts
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
      "default_values"
    ];

    keys.forEach(key => {
      const element = document.getElementById(key);
      if (element && data.settings[key] && data.settings[key][choosen_language]) {
        element.innerText = data.settings[key][choosen_language];
      }
    });

    document.getElementById("saveBtn").innerText = data["settings"]["save"][choosen_language];
}
updateTexts();