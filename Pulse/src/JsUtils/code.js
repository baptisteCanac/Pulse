const { invoke } = window.__TAURI__.core;
import MarkdownParser from "./MarkdownParser.js";

const editorParent = document.getElementById("editor");
const previewParent = document.getElementById("preview");
const loader = document.getElementById("loader");

let choosen_file_path = null;
const parser = new MarkdownParser(invoke);

require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs' } });

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

    async function openNewFileSource(source) {
      try {
        const [path, content] = await invoke("run_python_script");
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
    }

    // 1) Interception dans Monaco (quand l'éditeur a le focus)
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyO) {
        e.preventDefault();
        e.stopPropagation();
        openNewFileSource('monaco.onKeyDown');
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
      let html = await parser.parseAll(mdContent, "/dummy/path");
      html = html.replace(/^\s*---\s*$/gm, '<hr style="width: 100%; border: 0; border-top: 5px solid grey;">');
      previewParent.innerHTML = html;
      if (typeof Prism !== 'undefined') Prism.highlightAllUnder(previewParent);
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
