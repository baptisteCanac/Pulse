export default class RedirectionManager{
    constructor(homePath, exportPath, codePath, settingsPath){
        this.homePath = homePath;
        this.exportPath = exportPath;
        this.codePath = codePath;
        this.settingsPath = settingsPath;
    }

    initRedirections(){
        document.getElementById("home").addEventListener("click", () => {
            window.location.href = this.homePath;
        });

        document.getElementById("export").addEventListener("click", () => {
            window.location.href = this.exportPath;
        });

        document.getElementById("code").addEventListener("click", () => {
            window.location.href = this.codePath;
        });

        document.getElementById("settings").addEventListener("click", () => {
            window.location.href = this.settingsPath;
        });
    }
}