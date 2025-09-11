import ColorMode from "../JsUtils/ColorMode.js";
import MarkdownParser from "../JsUtils/MarkdownParser.js";
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

const { invoke } = window.__TAURI__.core;

/* Settings */
// 0: auto, 1: Light, 2: Dark
const theme = await invoke("get_theme");

const colorMode = new ColorMode("presentation");
const markdownParser = new MarkdownParser(invoke);

const shortcuts = await invoke("get_shortcuts");

let toggleOverlay = 0;
let actualSlide = 0;

let code = await invoke("get_code");
let presentationPath = await invoke("get_presentation_path");

// Parsing via la classe
code = await markdownParser.parseAll(code, presentationPath);

// Découpe les slides
let slideStrings = code.split(/^\s*---\s*$/gm);

// Crée <section>
let currentSlide = 0;
let slideElements = [];

function renderMath(container) {
  if (typeof katex === "undefined") {
    console.warn("KaTeX introuvable");
    return;
  }

  const displayRegex = /\$\$([\s\S]+?)\$\$/g;
  const inlineRegex = /(^|[^\\])\$(.+?)\$/g;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      text = text.replace(displayRegex, (match, g1) => {
        try {
          return katex.renderToString(g1, { displayMode: true, throwOnError: false });
        } catch (err) {
          console.error("Erreur KaTeX:", err);
          return match;
        }
      });
      text = text.replace(inlineRegex, (match, p1, g2) => {
        try {
          return p1 + katex.renderToString(g2, { displayMode: false, throwOnError: false });
        } catch (err) {
          console.error("Erreur KaTeX:", err);
          return match;
        }
      });
      const span = document.createElement('span');
      span.innerHTML = text;
      node.replaceWith(span);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(child => processNode(child));
    }
  }

  processNode(container);
}


slideStrings.forEach(element => {
  const new_section = document.createElement("section");
  const wrapper = document.createElement("div");
  wrapper.style.display = "inline";
  wrapper.innerHTML = element;

  new_section.appendChild(wrapper);
  new_section.style.display = "none";
  document.body.appendChild(new_section);
  slideElements.push(new_section);

  // Mermaid
  const mermaidBlocks = wrapper.querySelectorAll('pre.mermaid, div.mermaid');
mermaidBlocks.forEach(async (block) => {
    const codeText = block.textContent || "";
    const svgContainer = document.createElement('div');
    const uniqueId = 'mermaid-' + Math.random().toString(36).substr(2, 9);
    try {
        const { svg } = await mermaid.render(uniqueId, codeText); // <-- correction ici
        svgContainer.innerHTML = svg;
        block.replaceWith(svgContainer);
    } catch (err) {
        console.error("Mermaid error:", err, "Code:", codeText);
    }
});

  // KaTeX
  renderMath(wrapper);
});

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
    actualSlide--;
  }
}

function goToNextSlide() {
  if (currentSlide < slideElements.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
    actualSlide++;
  }
}

/* Shortcuts */

// go home
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || (event.ctrlKey && event.key.toLowerCase() === shortcuts["go_home"])) {
    window.location.href = "../index.html";
  }
});

// CTRL+O pour l'overlay
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLocaleLowerCase() === shortcuts["open_overlay"]) {
    if (toggleOverlay === 0) {
      toggleOverlay++;
      activateOverlay();
    } else {
      deactivateOverlay();
      toggleOverlay--;
    }
  }
});

deactivateOverlay();

function activateOverlay() {
  console.log("Activation de l'overlay");
  document.querySelector(".media-player-overlay").style.display = "flex";
}
function deactivateOverlay() {
  console.log("Désactivation de l'overlay");
  document.querySelector(".media-player-overlay").style.display = "none";
}

// Mode clair/sombre
if (theme === "0") {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (!prefersDark) {
    colorMode.lightModePresentation();
  }
} else if (theme === "1") {
  colorMode.lightModePresentation();
}

// Mermaid global
mermaid.initialize({
  startOnLoad: true,
  theme: 'default'
});

// Prism
Prism.highlightAll();

// Media Player
(function() {
  const playBtn = document.querySelector('.media-player-play-btn');
  const timeDisplay = document.querySelector('.media-player-time-display');
  const progressInfo = document.querySelector('.media-player-progress-info');

  let isPlaying = false;
  let currentTime = 0;

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    } else {
      return `${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(currentTime);
    progressInfo.textContent = `${currentSlide + 1}/${slideElements.length}`;
  }

  function syncWithCurrentSlide() {
    updateDisplay();
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playBtn.innerHTML = `<svg class="media-player-icon media-player-play-icon" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>`;
    } else {
      playBtn.innerHTML = `<svg class="media-player-icon media-player-play-icon" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>`;
    }
  });

  setInterval(() => {
    if (isPlaying) {
      currentTime++;
      updateDisplay();
    }
  }, 1000);

  document.querySelectorAll('.media-player-control-btn').forEach((btn, index) => {
    if (index === 2) { btn.addEventListener('click', () => { goToPreviousSlide(); syncWithCurrentSlide(); }); }
    else if (index === 3) { btn.addEventListener('click', () => { goToNextSlide(); syncWithCurrentSlide(); }); }
    else if (index === 1) { btn.addEventListener('click', () => { currentTime=0; updateDisplay(); }); }
  });

  function onSlideChange() { syncWithCurrentSlide(); }
  const originalGoToPrevious = window.goToPreviousSlide || goToPreviousSlide;
  const originalGoToNext = window.goToNextSlide || goToNextSlide;

  window.goToPreviousSlide = function() { originalGoToPrevious(); onSlideChange(); };
  window.goToNextSlide = function() { originalGoToNext(); onSlideChange(); };

  updateDisplay();

  window.mediaPlayer = {
    play: () => isPlaying || playBtn.click(),
    pause: () => isPlaying && playBtn.click(),
    reset: () => { currentTime=0; updateDisplay(); },
    getCurrentTime: () => currentTime,
    isPlaying: () => isPlaying
  };
})();