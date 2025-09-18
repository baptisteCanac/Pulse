const { invoke } = window.__TAURI__.core;
import ColorMode from "../lib/ColorMode.js";
import TranslateManager from "../lib/TranslateManager.js";
import JsonManager from "../lib/JsonManager.js";

let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark
const jsonlanguagesManager = new JsonManager("../../datas/languages.json");
const jsonDataManager = new JsonManager("../../datas/data.json");

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
    window.location.href = "../../index.html";
  });
  document.getElementById("export").addEventListener("click", () => {
    window.location.href = "../../html/export.html";
  });
  document.getElementById("code").addEventListener("click", () => {
    window.location.href = "../../html/code.html";
  });
});

async function update_button() {
  const data = await jsonlanguagesManager.getLanguagesData();

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

async function translate(){
  const translateManager = await new TranslateManager().init();
  translateManager.translateSidebar();
  translateManager.translateSettings();
}

translate();

async function updateShortcuts(){
  const data = await jsonDataManager.getShortcuts();

  const homeInput = document.getElementById("home_input");
  const overlayInput = document.getElementById("overlay_input");

  homeInput.value = data.go_home ?? "";
  overlayInput.value = data.open_overlay ?? "";
}

// Configure l'input pour n'accepter qu'une "touche" et mettre à jour value immédiatement
function setupShortcutInput(input) {
  // Capture la touche pressée
  input.addEventListener("keydown", (e) => {
    e.preventDefault(); // empêche l'insertion classique
    // Effacer avec Backspace / Delete
    if (e.key === "Backspace" || e.key === "Delete") {
      input.value = "";
      return;
    }
    // Caractère imprimable (lettre/chiffre/signe)
    if (e.key.length === 1) {
      input.value = e.key.toLowerCase();
      return;
    }
    // Quelques touches spéciales lisibles
    const specialMap = {
      " ": "Space",
      "Escape": "Esc",
      "Enter": "Enter",
      "Tab": "Tab",
      "ArrowLeft": "←",
      "ArrowRight": "→",
      "ArrowUp": "↑",
      "ArrowDown": "↓"
    };
    if (specialMap[e.key]) input.value = specialMap[e.key];
  });

  // Gérer le collage (prendre uniquement le premier caractère)
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const clipboard = (e.clipboardData || window.clipboardData).getData("text");
    if (clipboard && clipboard.length) {
      input.value = clipboard.trim()[0].toUpperCase();
    }
  });

  // Fallback pour mobiles / comportements étranges : garder 1 char max
  input.addEventListener("input", () => {
    if (input.value.length > 1) {
      input.value = input.value[0].toUpperCase();
    } else {
      input.value = input.value.toUpperCase();
    }
  });

  // Optionnel : select quand on focus pour pouvoir remplacer rapidement
  input.addEventListener("focus", () => input.select());
}

document.addEventListener("DOMContentLoaded", async () => {
  await updateShortcuts();

  // Initialise les inputs
  setupShortcutInput(document.getElementById("home_input"));
  setupShortcutInput(document.getElementById("overlay_input"));

  // Enregistrer : lire .value (qui est mis à jour par nos handlers)
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const newData = {
      go_home: document.getElementById("home_input").value,
      open_overlay: document.getElementById("overlay_input").value
    };
    console.log("Nouvelles données :", newData);
    const test = await invoke("save_new_shortcuts", ({shortcuts: newData}));
    console.log(test);
    // ici tu peux ajouter fetch POST / write si tu veux sauvegarder côté serveur
  });

  // Reset : recharge data.json et ré-applique les valeurs
  document.getElementById("default_values").addEventListener("click", async () => {
    await updateShortcuts();
    console.log("Valeurs par défaut rechargées.");
  });
});

async function updateCloseSidebarButton(){
  const isActive = await jsonDataManager.getSidebarOpened();

  const checkbox = document.getElementById("CloseSidebarCheckbox");

  if (checkbox.checked != isActive){
    checkbox.checked = true;
  }
}
updateCloseSidebarButton();

async function checkCloseSidebarCheckbox(){
  const checkbox = document.getElementById("CloseSidebarCheckbox");

  if (checkbox.checked == false){
    checkbox.checked = false;

    const check = await invoke("save_sidebar_state", {state: false});
    console.log(check);
  }else{
    checkbox.checked = true;

    const check = await invoke("save_sidebar_state", {state: true});
    console.log(check);
  }
}

document.getElementById("CloseSidebarCheckbox").addEventListener("click", () => {
  checkCloseSidebarCheckbox();
})