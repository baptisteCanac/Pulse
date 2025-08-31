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
