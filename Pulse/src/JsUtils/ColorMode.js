export default class ColorMode {
    constructor(type) {
        if (type === "index") {
            const temp = document.querySelector("app-sidebar");
            temp.addEventListener("rendered", () => {
                this.sidebar = temp.querySelector("aside");
                this.footer = this.sidebar.querySelector("div.mt-6");
                this.mainCard = document.querySelector("main > div");
                this.button = document.getElementById("openFileButton");
            });
        }
    }

    // Configuration centralisée des thèmes
    static themes = {
        light: {
            body: { add: ["bg-white", "text-gray-900"], remove: ["bg-gray-900", "text-white"] },
            sidebar: { add: ["bg-gray-100"], remove: ["bg-gray-800"] },
            footer: { add: ["text-gray-600"], remove: ["text-gray-400"] },
            mainCard: { add: ["bg-gray-50"], remove: ["bg-gray-800"] },
            button: { add: ["bg-blue-500"], remove: ["bg-blue-600"] },
            recentFiles: { add: ["bg-gray-200", "text-gray-900"], remove: ["bg-gray-700", "text-white"] }
        },
        dark: {
            body: { add: ["bg-gray-900", "text-white"], remove: ["bg-white", "text-gray-900"] },
            sidebar: { add: ["bg-gray-800"], remove: ["bg-gray-100"] },
            footer: { add: ["text-gray-400"], remove: ["text-gray-600"] },
            mainCard: { add: ["bg-gray-800"], remove: ["bg-gray-50"] },
            button: { add: ["bg-blue-600"], remove: ["bg-blue-500"] },
            recentFiles: { add: ["bg-gray-700", "text-white"], remove: ["bg-gray-200", "text-gray-900"] }
        }
    };

    // Méthode générique pour appliquer un thème
    applyTheme(themeName) {
        const theme = ColorMode.themes[themeName];
        if (!theme) return;

        // Application sur les éléments principaux
        const elements = {
            body: document.body,
            sidebar: this.sidebar,
            footer: this.footer,
            mainCard: this.mainCard,
            button: this.button
        };

        Object.entries(elements).forEach(([key, element]) => {
            if (element && theme[key]) {
                element.classList.remove(...theme[key].remove);
                element.classList.add(...theme[key].add);
            }
        });

        // Fichiers récents
        if (theme.recentFiles) {
            document.querySelectorAll(".recent-file").forEach(el => {
                el.classList.remove(...theme.recentFiles.remove);
                el.classList.add(...theme.recentFiles.add);
            });
        }
    }

    lightMode() { this.applyTheme('light'); }
    darkMode() { this.applyTheme('dark'); }

    // Configuration des styles CSS pour les modes présentation et settings
    static styles = {
        presentation: {
            light: `
body.presentation-light {
  background: #ffffff !important;
  color: #111827 !important;
}

body.presentation-light section {
  background: transparent !important;
  color: inherit !important;
}

body.presentation-light h1, body.presentation-light h2, body.presentation-light h3,
body.presentation-light h4, body.presentation-light h5, body.presentation-light h6 {
  color: #0f172a !important;
}

body.presentation-light p, body.presentation-light li {
  color: #0f172a !important;
}

body.presentation-light code, body.presentation-light pre {
  background: #f3f4f6 !important;
  color: #7b1e1b !important;
  border-radius: 6px;
}

body.presentation-light table {
  background: #f8fafc !important;
  color: #0f172a !important;
  border-radius: 8px;
  overflow: hidden;
}

body.presentation-light th {
  background: #e6e9ee !important;
  color: #0f172a !important;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0 !important;
}

body.presentation-light td {
  background: #ffffff !important;
  color: #0f172a !important;
  border-bottom: 1px solid #eef2f6 !important;
}

body.presentation-light tr:nth-child(even) td {
  background: #fbfdff !important;
}

body.presentation-light hr {
  border-top: 2px solid #e6e9ee !important;
}

body.presentation-light hr::after {
  color: #6b7280 !important;
}

body.presentation-light section img {
  box-shadow: 0 6px 18px rgba(16,24,40,0.06) !important;
}

body.presentation-light .hidden { display: none !important; }
body.presentation-light .active { display: flex !important; }`
        },
        settings: {
            light: `
body.settings-light {
  background: #ffffff !important;
  color: #111827 !important;
}

body.settings-light aside {
  background-color: #f3f4f6 !important;
  height: 100vh;
}

body.settings-light aside a:hover {
  color: #1e40af !important;
}

body.settings-light aside .mt-6 {
  color: #6b7280 !important;
}

body.settings-light h2, body.settings-light h3 {
  color: #111827 !important;
}

body.settings-light .toggle-switch.active {
  background-color: #3b82f6 !important;
}

body.settings-light .radio-button.active {
  border: 2px solid #3b82f6 !important;
}

body.settings-light span[style*="background-color: #374151"] {
  background-color: #e5e7eb !important;
  color: #111827 !important;
  border: 1px solid #d1d5db !important;
}`
        }
    };

    // Méthode générique pour appliquer des styles CSS
    applyStyleMode(mode, type, oppositeModeClass, styleId, darkStyleId) {
        document.body.classList.add(`${mode}-light`);
        document.body.classList.remove(`${mode}-dark`);

        // Supprime l'ancien style dark
        const darkStyle = document.getElementById(darkStyleId);
        if (darkStyle) darkStyle.remove();

        // Crée ou met à jour le style
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement("style");
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.textContent = ColorMode.styles[type].light;
    }

    lightModePresentation() {
        this.applyStyleMode(
            'presentation',
            'presentation',
            'presentation-dark',
            'presentation-light-styles',
            'presentation-dark-styles'
        );
    }

    lightModeSettings() {
        this.applyStyleMode(
            'settings',
            'settings',
            'settings-dark',
            'settings-light-styles',
            'settings-dark-styles'
        );
    }
}