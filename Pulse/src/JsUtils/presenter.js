const { invoke } = window.__TAURI__.core;

let code = await invoke("get_code");
let presentationPath = await invoke("get_presentation_path");
console.log("Chemin de la présentation :", presentationPath);

let currentSlide = 0;

// Markdown → HTML basique
code = String(code)
  .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
  .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
  .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
  .replace(/^###\s+(.*)$/gm,  '<h3>$1</h3>')
  .replace(/^##\s+(.*)$/gm,   '<h2>$1</h2>')
  .replace(/^#\s+(.*)$/gm,    '<h1>$1</h1>');

// Parse Markdown tables → HTML
code = code.replace(/((?:^\|.*\|$\n?)+)/gm, match => {
  const lines = match.trim().split("\n").filter(l => l.trim() !== "");
  if (lines.length < 2) return match;
  const separatorLine = lines[1].trim();
  if (!/^\|[- :|]+\|$/.test(separatorLine)) return match;

  let tableHTML = "<table><thead><tr>";
  const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
  headers.forEach(h => tableHTML += `<th>${h}</th>`);
  tableHTML += "</tr></thead><tbody>";
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

async function fixImagePaths(html, mdPath) {
  let mdDir = mdPath.replace(/\/?[^\/\\]+$/, '');
  const imgRegex = /<img\s+src=["'](.*?)["']\s*>/g;
  const matches = [...html.matchAll(imgRegex)];

  for (const match of matches) {
    const src = match[1];
    if (/^(\/|https?:)/.test(src)) continue; // absolu ou http → ok

    // Résolution chemin absolu du fichier md
    let parts = src.split(/[\\/]/);
    let baseParts = mdDir.split(/[\\/]/);
    for (let part of parts) {
      if (part === "..") baseParts.pop();
      else if (part !== ".") baseParts.push(part);
    }
    const resolvedPath = baseParts.join("/");

    // Lire le fichier depuis Rust et créer un Blob URL
    let bytes;
    try {
      bytes = await invoke("read_image", { path: resolvedPath });
    } catch (e) {
      console.error("Erreur lecture image :", e);
      continue;
    }

    const blob = new Blob([new Uint8Array(bytes)]);
    const url = URL.createObjectURL(blob);

    html = html.replace(match[0], `<img src="${url}">`);
  }

  return html;
}

code = await fixImagePaths(code, presentationPath);

// Découpe les slides correctement
let slideStrings = code.split(/^\s*---\s*$/gm);

// Crée <section>
console.log(slideStrings);
let slideElements = [];
slideStrings.forEach(element => {
  const new_section = document.createElement("section");
  new_section.innerHTML = element;
  new_section.style.display = "none";
  document.body.appendChild(new_section);
  slideElements.push(new_section);
});

// Affiche première slide
showSlide(currentSlide);

// Écoute clavier
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") goToPreviousSlide();
  if (event.key === "ArrowRight") goToNextSlide();
});

// Fonctions slides
function showSlide(index) {
  slideElements.forEach(s => (s.style.display = "none"));
  slideElements[index].style.display = "flex";
}

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

// escape function
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    // Retourner au home
    window.location.href = "../index.html"; 
  }
  if (event.ctrlKey && event.key.toLowerCase() === "h") {
    window.location.href = "../index.html";
  }
});