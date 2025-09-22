const { invoke } = window.__TAURI__.core;
import MarkdownParser from "../lib/MarkdownParser.js";
import ColorMode from "../lib/ColorMode.js";

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
    
    // Initialiser et rendre les diagrammes Mermaid
    if (window.mermaid) {
        window.mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose'
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
            });
        });
    }
}

codeTraitement();

function redirections(){
    const temp = document.querySelector("app-sidebar");
    temp.addEventListener("rendered", () => {
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
  } catch (err) {
    console.error("Erreur lors de l'application du thème :", err);
  }
}

applyTheme();