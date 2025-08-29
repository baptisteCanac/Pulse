const { invoke } = window.__TAURI__.core;

let code = await invoke("get_code");
let presentationPath = await invoke("get_presentation_path");
console.log(presentationPath);

let currentSlide = 0;

// Markdown → HTML basique
code = String(code)
  .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
  .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
  .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
  .replace(/^###\s+(.*)$/gm,  '<h3>$1</h3>')
  .replace(/^##\s+(.*)$/gm,   '<h2>$1</h2>')
  .replace(/^#\s+(.*)$/gm,    '<h1>$1</h1>');

// Parse Markdown tables into HTML (multi-line support)
code = code.replace(/((?:^\|.*\|$\n?)+)/gm, match => {
    const lines = match.trim().split("\n").filter(l => l.trim() !== "");
    if (lines.length < 2) return match; // pas un vrai tableau

    // Vérifier si la deuxième ligne est une ligne de séparateurs
    const separatorLine = lines[1].trim();
    if (!/^\|[- :|]+\|$/.test(separatorLine)) return match; // pas un vrai tableau

    let tableHTML = "<table>";
    
    // Header
    const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
    tableHTML += "<thead><tr>";
    headers.forEach(h => tableHTML += `<th>${h}</th>`);
    tableHTML += "</tr></thead>";

    // Body
    tableHTML += "<tbody>";
    for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split("|").map(c => c.trim()).filter(Boolean);
        if (cells.length === 0) continue;
        tableHTML += "<tr>";
        cells.forEach(c => tableHTML += `<td>${c}</td>`);
        tableHTML += "</tr>";
    }
    tableHTML += "</tbody></table>";

    return tableHTML;
});

function fixImagePaths(html, mdPath) {
  // Récupérer le répertoire du fichier md
  let mdDir = mdPath.replace(/\/?[^\/\\]+$/, ''); // supprime le nom du fichier

  // Regex pour trouver toutes les balises <img src="...">
  return html.replace(/<img\s+src=["'](.*?)["']/g, (match, src) => {
    // Si src est déjà absolu (commence par / ou http), on ne touche pas
    if (/^(\/|https?:)/.test(src)) return match;

    // Crée un chemin absolu
    let parts = src.split(/[\\/]/); // sépare par / ou \
    let baseParts = mdDir.split(/[\\/]/);

    for (let part of parts) {
      if (part === "..") baseParts.pop();
      else if (part !== ".") baseParts.push(part);
    }

    let fixedPath = baseParts.join("/");

    return `<img src="${fixedPath}"`;
  });
}

code = fixImagePaths(code, presentationPath);

// Découpe en slides
let slideStrings = String(code).split(/^\-{3}$/gm);

// Tableau des <section> DOM
let slideElements = [];

// Création des <section>
slideStrings.forEach(element => {
  const new_section = document.createElement("section");
  new_section.innerHTML = element;
  new_section.style.display = "none"; // cachée par défaut
  document.body.appendChild(new_section);
  slideElements.push(new_section);
});

// Affiche la première slide
showSlide(currentSlide);

// Écoute clavier
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goToPreviousSlide();
  if (event.key === "ArrowRight") goToNextSlide();
});

// Fonction affichage
function showSlide(index) {
  slideElements.forEach(s => (s.style.display = "none"));
  slideElements[index].style.display = "flex";
}

// Navigation
function goToPreviousSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  }
  console.log("🔙 Slide précédente :", currentSlide);
}

function goToNextSlide() {
  if (currentSlide < slideElements.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
  console.log("🔜 Slide suivante :", currentSlide);
}