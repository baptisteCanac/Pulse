export default class ColorMode{
    constructor(){

    }

    sidebar(theme){
        if (theme == 2){
            console.log("sidebar dark mode");
            document.documentElement.style.setProperty("--bg", "var(--bg-dark)");
            document.documentElement.style.setProperty("--bg-sidebar", "var(--bg-grey-dark)");
            document.documentElement.style.setProperty("--color", "var(--color-dark)");
        }else{
            console.log("sidebar light mode");
            document.documentElement.style.setProperty("--bg", "var(--bg-light)");
            document.documentElement.style.setProperty("--bg-sidebar", "var(--bg-grey-light)");
            document.documentElement.style.setProperty("--color", "var(--color-light)");
        }
    }
}