import ColorMode from "../JsUtils/ColorMode.js";
import MarkdownParser from "../JsUtils/MarkdownParser.js";
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

const { invoke } = window.__TAURI__.core;

const colorMode = new ColorMode("presentation");
const markdownParser = new MarkdownParser(invoke);

let toggleOverlay = 0;
let actualSlide = 0;

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
    actualSlide --;
  }
}

function goToNextSlide() {
  if (currentSlide < slideElements.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
    actualSlide ++;
  }
}

// Escape et Ctrl+H
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || (event.ctrlKey && event.key.toLowerCase() === "h")) {
    window.location.href = "../index.html";
  }
});

// CTRL+O pour l'overlay
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLocaleLowerCase() === "o"){
    if (toggleOverlay === 0 ){
      toggleOverlay ++;
      activateOverlay();
    }else{
      deactivateOverlay();
      toggleOverlay --;
    }
  }
});

deactivateOverlay();

function activateOverlay(){
  console.log("activation de l'overlay");
  document.querySelector(".media-player-overlay").style.display = "flex";
}
function deactivateOverlay(){
  console.log("Desactivation de l'overlay");
  document.querySelector(".media-player-overlay").style.display = "none";
}

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

// Remplacez la partie du media player dans votre code par ceci :

(function() {
  // Encapsulation pour éviter les conflits de variables globales
  const playBtn = document.querySelector('.media-player-play-btn');
  const timeDisplay = document.querySelector('.media-player-time-display');
  const progressInfo = document.querySelector('.media-player-progress-info');
            
  let isPlaying = false;
  let currentTime = 0; // temps en secondes
  let slideStartTime = 0; // temps de début de la slide actuelle

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
                
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(currentTime);
    progressInfo.textContent = `${currentSlide + 1}/${slideElements.length}`;
  }

  // Fonction pour synchroniser le player avec les slides
  function syncWithCurrentSlide() {
    updateDisplay();
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      slideStartTime = currentTime; // Marque le temps de début de lecture
      playBtn.innerHTML = `
        <svg class="media-player-icon media-player-play-icon" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
    } else {
      playBtn.innerHTML = `
        <svg class="media-player-icon media-player-play-icon" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  });

  // Simulation du temps qui passe
  setInterval(() => {
    if (isPlaying) {
      currentTime++;
      updateDisplay();
    }
  }, 1000);

  // Gestion des boutons précédent/suivant
  document.querySelectorAll('.media-player-control-btn').forEach((btn, index) => {
    if (index === 2) { // Bouton précédent
      btn.addEventListener('click', () => {
        goToPreviousSlide();
        syncWithCurrentSlide();
      });
    } else if (index === 3) { // Bouton suivant
      btn.addEventListener('click', () => {
        goToNextSlide();
        syncWithCurrentSlide();
      });
    } else if (index === 1) { // Bouton actualiser/reset
      btn.addEventListener('click', () => {
        currentTime = 0;
        slideStartTime = 0;
        updateDisplay();
      });
    }
  });

  // Écouteur pour synchroniser quand on change de slide avec le clavier
  function onSlideChange() {
    syncWithCurrentSlide();
  }

  // Ajouter l'écouteur aux fonctions de navigation existantes
  const originalGoToPrevious = window.goToPreviousSlide || goToPreviousSlide;
  const originalGoToNext = window.goToNextSlide || goToNextSlide;

  window.goToPreviousSlide = function() {
    originalGoToPrevious();
    onSlideChange();
  };

  window.goToNextSlide = function() {
    originalGoToNext();
    onSlideChange();
  };

  // Initialisation
  updateDisplay();

  // Export des fonctions pour usage externe si nécessaire
  window.mediaPlayer = {
    play: () => isPlaying || playBtn.click(),
    pause: () => isPlaying && playBtn.click(),
    reset: () => {
      currentTime = 0;
      slideStartTime = 0;
      updateDisplay();
    },
    getCurrentTime: () => currentTime,
    isPlaying: () => isPlaying
  };
})();