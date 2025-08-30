import ColorMode from "../JsUtils/ColorMode.js";
import MarkdownParser from "../JsUtils/MarkdownParser.js";
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

const { invoke } = window.__TAURI__.core;

const colorMode = new ColorMode("presentation");
const markdownParser = new MarkdownParser(invoke);

let code = await invoke("get_code");
let presentationPath = await invoke("get_presentation_path");
console.log("Chemin de la présentation :", presentationPath);

// Parsing via la classe
code = await markdownParser.parseAll(code, presentationPath);

// Découpe les slides
let slideStrings = code.split(/^\s*---\s*$/gm);

// Crée <section>
let currentSlide = 0;
let slideElements = [];

slideStrings.forEach(element => {
  const new_section = document.createElement("section");
  const wrapper = document.createElement("div");
  wrapper.style.display = "inline";
  wrapper.innerHTML = element;

  new_section.appendChild(wrapper);
  new_section.style.display = "none";
  document.body.appendChild(new_section);
  slideElements.push(new_section);
});

console.log(slideStrings);

// Affiche première slide
showSlide(currentSlide);

// Navigation clavier
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") goToPreviousSlide();
  if (event.key === "ArrowRight") goToNextSlide();
});

function showSlide(index) {
  slideElements.forEach(s => (s.style.display = "none"));
  slideElements[index].style.display = "flex";
}

function goToPreviousSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  }
}

function goToNextSlide() {
  if (currentSlide < slideElements.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
}

// Escape et Ctrl+H
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || (event.ctrlKey && event.key.toLowerCase() === "h")) {
    window.location.href = "../index.html";
  }
});

// Mode clair/sombre
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (!prefersDark) {
  colorMode.lightModePresentation();
}

// mermaid

mermaid.initialize({
    startOnLoad: true, // Scanne toute la page et convertit automatiquement
    theme: 'default'   // Tu peux changer: 'dark', 'neutral', etc.
  });

slideElements.forEach(section => {
    const mermaidBlocks = section.querySelectorAll('pre.mermaid');
    if (mermaidBlocks.length > 0) {
        mermaid.init(undefined, mermaidBlocks);
    }
});

// text coloration

Prism.highlightAll();