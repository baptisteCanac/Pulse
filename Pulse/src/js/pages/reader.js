const { invoke } = window.__TAURI__.core;
import MarkdownParser from "../lib/MarkdownParser.js";
import ColorMode from "../lib/ColorMode.js";

let currentTheme = 'default'; // Variable pour stocker le thème actuel

async function getMermaidTheme() {
    const theme = parseInt(await invoke("get_theme"), 10);
    
    if (theme === 1) {
        // Light mode
        return 'default';
    } else if (theme === 2) {
        // Dark mode
        return 'dark';
    } else {
        // Auto : détecter le système
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return 'dark';
        } else {
            return 'default';
        }
    }
}

async function renderMermaidDiagrams(container) {
    if (!window.mermaid) return;
    
    // Obtenir le bon thème
    const mermaidTheme = await getMermaidTheme();
    currentTheme = mermaidTheme;
    
    // Initialiser Mermaid avec le bon thème
    window.mermaid.initialize({
        startOnLoad: false,
        theme: mermaidTheme,
        securityLevel: 'loose',
        themeVariables: mermaidTheme === 'default' ? {
            // Variables pour le thème clair
            primaryColor: '#ffffff',
            primaryTextColor: '#333333',
            primaryBorderColor: '#cccccc',
            lineColor: '#333333'
        } : {
            // Variables pour le thème sombre
            primaryColor: '#1f2937',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#4b5563',
            lineColor: '#ffffff'
        }
    });
    
    // Chercher et rendre tous les diagrammes Mermaid
    const mermaidElements = container.querySelectorAll('.mermaid, code.language-mermaid');
    mermaidElements.forEach((element, index) => {
        if (element.tagName === 'CODE') {
            // Si c'est un élément code, créer un div mermaid
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.textContent = element.textContent;
            element.parentNode.replaceWith(mermaidDiv);
            element = mermaidDiv;
        }
        
        // Rendre le diagramme
        const graphDefinition = element.textContent;
        const graphId = `mermaid-${index}`;
        window.mermaid.render(graphId, graphDefinition).then(({ svg }) => {
            element.innerHTML = svg;
        }).catch(err => {
            console.error('Erreur lors du rendu Mermaid:', err);
        });
    });
}

async function codeTraitement(){
    const markdownParser = new MarkdownParser(invoke);
    const container = document.getElementById("container");
    let code = await invoke("get_code");
    let presentationPath = await invoke("get_presentation_path");
    code = await markdownParser.parseAll(code, presentationPath);
    container.innerHTML = code;
    
    // Rendre les formules LaTeX après insertion
    markdownParser.renderMathElements();
    
    // Appliquer la coloration syntaxique Prism.js
    if (window.Prism) {
        window.Prism.highlightAll();
    }
    
    // Rendre les diagrammes Mermaid avec le bon thème
    await renderMermaidDiagrams(container);
}

codeTraitement();

function redirections(){
    document.getElementById("home").addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
    document.getElementById("export").addEventListener("click", () => {
        window.location.href = "../../html/export.html";
    });
    document.getElementById("code").addEventListener("click", () => {
        window.location.href = "../../html/code.html";
    });
    document.getElementById("settings").addEventListener("click", () => {
        window.location.href = "../../html/settings.html";
    });
}

redirections();

async function applyTheme() {
    const colorMode = new ColorMode("index");
    const theme = parseInt(await invoke("get_theme"), 10);
    try {
        // Appliquer le thème
        if (theme === 1) {
            colorMode.applyLightModeSidebar();
        } else if (theme === 2) {
            colorMode.darkModeSidebar();
        } else {
            // Auto : détecter le système
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                colorMode.darkModeSidebar();
            } else {
                colorMode.applyLightModeSidebar();
            }
        }
        
        // Re-rendre les diagrammes Mermaid si le thème a changé
        const newMermaidTheme = await getMermaidTheme();
        if (newMermaidTheme !== currentTheme) {
            const container = document.getElementById("container");
            if (container) {
                await renderMermaidDiagrams(container);
            }
        }
    } catch (err) {
        console.error("Erreur lors de l'application du thème :", err);
    }
}

applyTheme();

async function shortcuts(){
  const shortcuts = await invoke("get_shortcuts");

  // go home
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || (event.ctrlKey && event.key.toLowerCase() === shortcuts["go_home"])) {
      window.location.href = "../index.html";
    }
  });
}
shortcuts();

async function test(){
    const colorMode = new ColorMode("index");
    const theme = parseInt(await invoke("get_theme"), 10);
    const element = document.querySelector("aside");

    console.log(theme);
    if (theme == 1){
        // light mode
        element.style.background = "var(--bg-grey-light)";
    }else if (theme == 2){
        element.style.background = "var(--bg-grey-dark)";
    }else{
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            colorMode.darkModeSidebar();
        } else {
            colorMode.applyLightModeSidebar();
        }
    }
}
test();