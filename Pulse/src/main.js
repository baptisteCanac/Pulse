const { invoke } = window.__TAURI__.core;
import ColorMode from "./JsUtils/ColorMode.js";

const colorMode = new ColorMode();
let toggleColorMode = 0;

window.addEventListener("DOMContentLoaded", () => {
  console.log("coucou");
  document.getElementById("toggleColorMode").addEventListener("click", () => {
    if (toggleColorMode == 0){
      colorMode.lightMode();
      toggleColorMode ++;
    }else{
      colorMode.darkMode();
      toggleColorMode --;
    }
  })
});
