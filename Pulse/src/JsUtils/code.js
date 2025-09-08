const { invoke } = window.__TAURI__.core;

import MarkdownParser from "./MarkdownParser.js";

let starter;

const editorParent = document.getElementById("editor");
const previewParent = document.getElementById("preview");
const loader = document.getElementById("loader");

async function fetchMd() {
  try {
    starter = await invoke('get_md_starter');
  } catch (error) {
    console.error(error);
  }
}

fetchMd();

const parser = new MarkdownParser(invoke);

// Charger Monaco
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs' } });

function redirections() {
    const temp = document.querySelector("app-sidebar");

    temp.addEventListener("rendered", () => {
      document.getElementById("home").addEventListener("click", () => {
        window.location.href = "../index.html";
      });
      document.getElementById("exportToPdf").addEventListener("click", () => {
        window.location.href = "pdfExport.html";
      });
      document.getElementById("settings").addEventListener("click", () => {
        window.location.href = "settings.html";
      });
    });
  }

  redirections();

require(['vs/editor/editor.main'], function() {
  const editor = monaco.editor.create(editorParent, {
    value: starter,
    language: 'markdown',
    theme: 'vs-dark',
    automaticLayout: true, // s'adapte à la taille
  });

  async function updatePreview() {
    const mdContent = editor.getValue();
    let html = await parser.parseAll(mdContent, "/dummy/path");

    html = html.replace(/^\s*---\s*$/gm, '<hr style="width: 100%; border: 0; border-top: 5px solid grey;">');

    previewParent.innerHTML = html;
  }

  // Premier rendu
  (async () => {
    await updatePreview();
    hideLoader();
  })();

  // Update live
  editor.onDidChangeModelContent(updatePreview);

  function hideLoader() {
    loader.classList.add("opacity-0");
    setTimeout(() => loader.style.display = "none", 500);
  }
});
