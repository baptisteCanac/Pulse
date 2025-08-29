const { invoke } = window.__TAURI__.core;
import ColorMode from "./JsUtils/ColorMode.js";
import JsonManager from "./JsUtils/JsonManager.js";

const jsonManager = new JsonManager("datas/data.json");
const recent_files_container = document.getElementById("recent_files_container");

const colorMode = new ColorMode();
let toggleColorMode = 0;

async function selectFile(){
  const selectedfilePath = await invoke("select_file", { scriptPath: "../src/scripts/pick_file.py" });

  console.log(await invoke("new_recent_file", {newRecentFilePath: selectedfilePath }));

  window.location.href = "html/presenter.html";
}

window.addEventListener("DOMContentLoaded", () => {
  (async () => {
    const titles = await jsonManager.getRecentFileTitles();
    titles.forEach(element => {
      console.log(element);
      const new_recent_file = document.createElement("div")
      new_recent_file.setAttribute("class", "bg-gray-700 p-3 rounded-lg");
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
});
