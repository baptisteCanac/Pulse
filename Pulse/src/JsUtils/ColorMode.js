export default class ColorMode {
    constructor() {
        this.sidebar = document.querySelector("aside");
        this.footer = this.sidebar.querySelector("div.mt-6");
        this.mainCard = document.querySelector("main > div");
        this.button = document.getElementById("openFileButton");
    }

    lightMode() {
        document.getElementById("titleColorMode").innerText = "Dark mode";
        document.getElementById("emojiColorMode").innerText = "🌙";

        document.body.classList.remove("bg-gray-900", "text-white");
        document.body.classList.add("bg-white", "text-gray-900");

        this.sidebar.classList.remove("bg-gray-800");
        this.sidebar.classList.add("bg-gray-100");

        this.footer.classList.remove("text-gray-400");
        this.footer.classList.add("text-gray-600");

        this.mainCard.classList.remove("bg-gray-800");
        this.mainCard.classList.add("bg-gray-50");

        this.button.classList.remove("bg-blue-600");
        this.button.classList.add("bg-blue-500");

        // 🔥 Fichiers récents
        document.querySelectorAll(".recent-file").forEach(el => {
            el.classList.remove("bg-gray-700", "text-white");
            el.classList.add("bg-gray-200", "text-gray-900");
        });
    }

    darkMode() {
        document.getElementById("titleColorMode").innerText = "Light mode";
        document.getElementById("emojiColorMode").innerText = "☀️";

        document.body.classList.remove("bg-white", "text-gray-900");
        document.body.classList.add("bg-gray-900", "text-white");

        this.sidebar.classList.remove("bg-gray-100");
        this.sidebar.classList.add("bg-gray-800");

        this.footer.classList.remove("text-gray-600");
        this.footer.classList.add("text-gray-400");

        this.mainCard.classList.remove("bg-gray-50");
        this.mainCard.classList.add("bg-gray-800");

        this.button.classList.remove("bg-blue-500");
        this.button.classList.add("bg-blue-600");

        // 🔥 Fichiers récents
        document.querySelectorAll(".recent-file").forEach(el => {
            el.classList.remove("bg-gray-200", "text-gray-900");
            el.classList.add("bg-gray-700", "text-white");
        });
    }
}