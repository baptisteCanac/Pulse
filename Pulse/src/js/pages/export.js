const { invoke } = window.__TAURI__.core;
import TranslateManager from "../lib/TranslateManager.js";
import ColorManager from "../lib/ColorManager.js";
import MarkdownParser from "../lib/MarkdownParser.js";

let theme = 0; // 0 = Auto, 1 = Light, 2 = Dark
let code;
let codePath;

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
    })
}

redirections();
translate();
updateTheme();
listeners();