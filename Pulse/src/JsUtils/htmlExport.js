const { invoke } = window.__TAURI__.core;

function redirections(){
    const temp = document.querySelector("app-sidebar");

    temp.addEventListener("rendered", () => {
        document.getElementById("home").addEventListener("click", () => {
            window.location.href = "../index.html";
        });
        document.getElementById("code").addEventListener("click", () => {
            window.location.href = "code.html";
        });
        document.getElementById("settings").addEventListener("click", () => {
            window.location.href = "settings.html";
        });
    });
}

redirections();