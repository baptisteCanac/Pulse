const { invoke } = window.__TAURI__.core;
import ColorMode from "./JsUtils/ColorMode.js";
import JsonManager from "./JsUtils/JsonManager.js";

const jsonManager = new JsonManager("datas/data.json");
const recent_files_container = document.getElementById("recent_files_container");

const colorMode = new ColorMode("index");
let toggleColorMode = 1;

async function selectFile(){
  const selectedfilePath = await invoke("select_file", { scriptPath: "../src/scripts/pick_file.py" });

  console.log(await invoke("new_recent_file", {newRecentFilePath: selectedfilePath }));

  window.location.href = "html/presenter.html";
}

window.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const titles = await jsonManager.getRecentFileTitles();
    titles.forEach(element => {
      const new_recent_file = document.createElement("div");
      if (toggleColorMode === 0){
        new_recent_file.setAttribute("class", "recent-file p-3 bg-gray-700 rounded-lg"); 
      }else{
        new_recent_file.setAttribute("class", "recent-file p-3 bg-gray-200 rounded-lg"); 
      }
      new_recent_file.innerText = element;
      recent_files_container.appendChild(new_recent_file);
    });
  })();

  document.getElementById("toggleColorMode").addEventListener("click", () => {
    if (toggleColorMode == 0){
      colorMode.lightMode();
      toggleColorMode ++;
    }else{
      colorMode.darkMode();
      toggleColorMode --;
    }
  });

  document.getElementById("openFileButton").addEventListener("click", () => {
    selectFile();
  });

  // Vérifier si le système est en mode sombre
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (prefersDark) {
    toggleColorMode = 0;
  } else {
    toggleColorMode = 1;
  }

  // 🔥 Forcer le mode clair sur les nouveaux éléments
  if (toggleColorMode === 1) {
    colorMode.lightMode();
  } else{
    colorMode.darkMode();
  }

  document.getElementById("exportToHtml").addEventListener("click", () => {
    window.location.href = "html/htmlExport.html";
  })

});
