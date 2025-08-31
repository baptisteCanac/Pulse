const { invoke } = window.__TAURI__.core;

function redirections(){
    const temp = document.querySelector("app-sidebar");

    temp.addEventListener("rendered", () => {
        document.getElementById("home").addEventListener("click", () => {
            window.location.href = "../index.html";
        });
        document.getElementById("exportToPdf").addEventListener("click", () => {
            window.location.href = "pdfExport.html";
        });
        document.getElementById("settings").addEventListener("click", () => {
            window.location.href = "settings.html";
        });
    });
}

redirections();