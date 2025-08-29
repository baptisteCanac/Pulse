const { invoke } = window.__TAURI__.core;

let code = await invoke("get_code");

let currentSlide = 0;

// Markdown → HTML basique
code = String(code)
  .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
  .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
  .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
  .replace(/^###\s+(.*)$/gm,  '<h3>$1</h3>')
  .replace(/^##\s+(.*)$/gm,   '<h2>$1</h2>')
  .replace(/^#\s+(.*)$/gm,    '<h1>$1</h1>');

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