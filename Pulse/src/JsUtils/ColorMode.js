export default class ColorMode{
    constructor(){
        console.log("Color mode class initialised");
    }

    lightMode() {
        document.getElementById("titleColorMode").innerText = "Dark mode";
        document.getElementById("emojiColorMode").innerText = "🌙";

        document.body.classList.remove("bg-gray-900", "text-white");
        document.body.classList.add("bg-white", "text-gray-900");

        const sidebar = document.querySelector("aside");
        sidebar.classList.remove("bg-gray-800");
        sidebar.classList.add("bg-gray-100");

        const footer = sidebar.querySelector("div.mt-6");
        footer.classList.remove("text-gray-400");
        footer.classList.add("text-gray-600");

        const mainCard = document.querySelector("main > div");
        mainCard.classList.remove("bg-gray-800");
        mainCard.classList.add("bg-gray-50");

        const button = document.getElementById("openFileButton");
        button.classList.remove("bg-blue-600", "text-white");
        button.classList.add("bg-blue-500", "text-white");

        // Changer le style des recent files en mode clair
        const recentFileElements = document.querySelectorAll(".bg-gray-700");

        recentFileElements.forEach(el => {
            el.classList.remove("bg-gray-700", "text-white");
            el.classList.add("bg-gray-200", "text-gray-900");
        });
    }

    darkMode() {
        document.getElementById("titleColorMode").innerText = "Light mode";
        document.getElementById("emojiColorMode").innerText = "☀️";

        document.body.classList.remove("bg-white", "text-gray-900");
        document.body.classList.add("bg-gray-900", "text-white");

        const sidebar = document.querySelector("aside");
        sidebar.classList.remove("bg-gray-100");
        sidebar.classList.add("bg-gray-800");

        const footer = sidebar.querySelector("div.mt-6");
        footer.classList.remove("text-gray-600");
        footer.classList.add("text-gray-400");

        const mainCard = document.querySelector("main > div");
        mainCard.classList.remove("bg-gray-50");
        mainCard.classList.add("bg-gray-800");

        const button = document.getElementById("openFileButton");
        button.classList.remove("bg-blue-500", "text-white");
        button.classList.add("bg-blue-600", "text-white");

        // Changer le style des recent files en mode sombre
        const recentFileElements = document.querySelectorAll(".bg-gray-700");
        
        recentFileElements.forEach(el => {
            el.classList.remove("bg-gray-200", "text-gray-900");
            el.classList.add("bg-gray-700", "text-white");
        });
    }
}