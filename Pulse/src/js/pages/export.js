const { invoke } = window.__TAURI__.core;
import TranslateManager from "../lib/TranslateManager.js";
import ColorManager from "../lib/ColorManager.js";
import MarkdownParser from "../lib/MarkdownParser.js";
import RedirectionManager from "../lib/RedirectionManager.js";

const redirectionManager = new RedirectionManager(
    "../../index.html",
    "#",
    "../../html/code.html",
    "../../html/settings.html"
);
let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark
let code;
let codePath;

redirectionManager.initRedirections();

async function translate(){
    const translateManager = await new TranslateManager().init();
    translateManager.translateSidebar();
    translateManager.translateExport();
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

async function chooseFile(){
    const chooseFile = await invoke("open_new_file");
    codePath = chooseFile[0];
    code = chooseFile[1];
}

async function cta(){
    const markdownParser = new MarkdownParser(invoke);

    code = await markdownParser.parseAll(code, codePath);

    const format = document.getElementById("export-format").value;
    const looper = document.getElementById("loopCheckbox").checked;
    const protect = document.getElementById("protectCheckbox").checked;
    const page_size = document.getElementById("page-size").value;

    const callCreatePdf = await invoke("create_pdf", {
        format: format,
        looper: looper,
        protect: protect,
        pageSize: page_size,
        parsedCode: code
    });

    console.log(callCreatePdf);
}

function listeners(){
    document.getElementById("chooseFile").addEventListener("click", () => {
        chooseFile();
    })
    document.getElementById("cta").addEventListener("click", () => {
        cta();
    });
    document.getElementById("closePopupButton").addEventListener("click", () => {
      closePopup();
    });
    document.getElementById("goBackButton").addEventListener("click", () => {
      goBack();
    })
}

// Fonction pour fermer la popup
function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  const popup = overlay.querySelector('div');

  // Animation de fermeture
  popup.style.transform = 'scale(0.95)';
  popup.style.opacity = '0';
  overlay.style.opacity = '0';

  setTimeout(() => {
    overlay.style.display = 'none';
  }, 300);
}

// Fonction pour retourner en arrière
function goBack() {
  window.history.back();
}

// Empêcher la fermeture en cliquant en dehors de la popup
document.getElementById('popup-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    // Ne rien faire - la popup ne se ferme que avec les boutons
  }
});

// Animation d'entrée de la popup
window.addEventListener('load', function() {
  const overlay = document.getElementById('popup-overlay');
  const popup = overlay.querySelector('div');

  // Commencer avec une popup invisible et réduite
  popup.style.transform = 'scale(0.9)';
  popup.style.opacity = '0';

  // Animer l'apparition
  setTimeout(() => {
    popup.style.transform = 'scale(1)';
    popup.style.opacity = '1';
    }, 100);
});

translate();
updateTheme();
listeners();