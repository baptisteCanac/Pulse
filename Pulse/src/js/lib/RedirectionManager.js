export default class RedirectionManager{
    constructor(){
        console.log("Ok");
    }

    initRedirections(){
        document.getElementById("export").addEventListener("click", () => {
            window.location.href = "html/export.html";
        });

        document.getElementById("code").addEventListener("click", () => {
            window.location.href = "html/code.html";
        });

        document.getElementById("settings").addEventListener("click", () => {
            window.location.href = "html/settings.html";
        });
    }
}