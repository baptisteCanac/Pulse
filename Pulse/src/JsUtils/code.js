const { invoke } = window.__TAURI__.core;
import MarkdownParser from "./MarkdownParser.js";

const editorParent = document.getElementById("editor");
const previewParent = document.getElementById("preview");
const loader = document.getElementById("loader");
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

/* 
Say if the document actually in modification is saved or not

By default is the starter so he is not saved

0 : File not existing
1: File existing
*/
let editor_type = 0;

let choosen_file_path = null;
const parser = new MarkdownParser(invoke);

require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs' } });

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

async function getStarter() {
  try {
    return await invoke('get_md_starter');
  } catch (e) {
    console.error("get_md_starter error:", e);
    return "";
  }
}

(async function init() {
  const starter = await getStarter();

  require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(editorParent, {
      value: starter || '',
      language: 'markdown',
      theme: 'vs-dark',
      automaticLayout: true,
    });

    async function createNewFile(){
      editor.setValue("");

      if (typeof updatePreview === 'function') {
        await updatePreview();
      }

      editor_type = 0;
    }

    async function saveFile(){
      if (editor_type === 0){
        const text = editor.getValue(); // texte actuel de l'éditeur
        try {
          const newFilePath = await invoke("create_new_file", { text });
          console.log("Nouveau fichier créé :", newFilePath);
          choosen_file_path = newFilePath;
          editor_type = 1;
        } catch (err) {
          console.error("Erreur création nouveau fichier :", err);
        }
      }else{
        // File existing
        const test = await invoke("save_existing_file", {path: choosen_file_path, text: editor.getValue()});
      }
    }

    async function openNewFileSource(source) {
      try {
        const [path, content] = await invoke("open_new_file");
        console.log("Chemin :", path);
        choosen_file_path = path;
        console.log("Contenu :", content);

        // ✅ Remplacer le contenu de l'éditeur
        editor.setValue(content);

        // ✅ Mettre à jour la preview après changement
        if (typeof updatePreview === 'function') {
          await updatePreview();
        }
      } catch (err) {
        console.error("Erreur :", err);
      }

      editor_type = 1;
    }

    // 1) Interception dans Monaco (quand l'éditeur a le focus)
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyO) {
        e.preventDefault();
        e.stopPropagation();
        openNewFileSource('monaco.onKeyDown');
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyN){
        e.preventDefault();
        e.stopPropagation();
        createNewFile();
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyS){
        e.preventDefault();
        e.stopPropagation();
        saveFile();
      }
    });

    // 2) Action Monaco (redondante mais utile pour la palette de commandes)
    editor.addAction({
      id: 'open-new-file-action',
      label: 'Ouvrir un nouveau fichier',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO],
      run: () => { openNewFileSource('monaco.addAction'); return null; }
    });

    // 3) Listener global en capture (doit s'exécuter AVANT la plupart des handlers)
    document.addEventListener('keydown', (ev) => {
      // use 'code' pour la touche physique (KeyO), plus fiable que .key sur certains layouts
      if ((ev.ctrlKey || ev.metaKey) && ev.code === 'KeyO') {
        ev.preventDefault();
        ev.stopPropagation();
        openNewFileSource('document.capture');
      }
    }, true); // <-- important: capture = true

    // Preview / update (ton code existant)
    async function updatePreview() {
  const mdContent = editor.getValue();

  // Transformation Markdown -> HTML
  let html = await parser.parseAll(mdContent, "/dummy/path");

  // Remplacement des séparateurs --- par des <hr>
  html = html.replace(/^\s*---\s*$/gm, '<hr style="width: 100%; border: 0; border-top: 5px solid grey;">');

  // Injection dans le preview
  previewParent.innerHTML = html;

  // Initialisation Prism pour le code
  if (typeof Prism !== 'undefined') Prism.highlightAllUnder(previewParent);

  // Initialisation Mermaid uniquement dans le preview
  if (typeof mermaid !== 'undefined') {
    const mermaidBlocks = previewParent.querySelectorAll('pre.mermaid, div.mermaid');
    if (mermaidBlocks.length > 0) {
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
      mermaidBlocks.forEach(block => mermaid.init(undefined, block));
    }
  }
}


    (async () => { await updatePreview(); hideLoader(); })();
    editor.onDidChangeModelContent(updatePreview);

    function hideLoader() {
      loader.classList.add("opacity-0");
      setTimeout(() => loader.style.display = "none", 500);
    }

    window._monacoEditor = editor; // debug
  });
})();
