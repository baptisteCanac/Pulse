const { invoke } = window.__TAURI__.core;

document.getElementById("goHome").addEventListener("click", () => {
    window.location.href = "../index.html";
});