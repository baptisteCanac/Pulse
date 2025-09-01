import { EditorView, basicSetup } from "https://esm.sh/@codemirror/basic-setup";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown";
import MarkdownParser from "./MarkdownParser.js";

const editorParent = document.getElementById("editor");
const previewParent = document.getElementById("preview");
const loader = document.getElementById("loader");

// Dummy invoke
async function invoke(cmd, args) {
  if (cmd === "read_image") return new Uint8Array();
  return null;
}

const parser = new MarkdownParser(invoke);

// Créer l'éditeur
const editor = new EditorView({
  doc: "# Titre 1\n## Titre 2\n\n- Item 1\n- Item 2\n\n`Code inline`",
  extensions: [basicSetup, markdown()],
  parent: editorParent,
});

// Mettre à jour la preview
async function updatePreview() {
  const mdContent = editor.state.doc.toString();
  let html = await parser.parseAll(mdContent, "/dummy/path");

  html = html.replace(/^\s*---\s*$/gm, '<hr style="width: 100%; border: 0; border-top: 5px solid grey;">');

  previewParent.innerHTML = html;
}

// Fonction pour cacher le loader
function hideLoader() {
  loader.classList.add("opacity-0");
  setTimeout(() => loader.style.display = "none", 500);
}

// Quand tout est prêt
(async () => {
  await updatePreview(); // On attend le rendu initial
  hideLoader();          // Cache le loader
})();

// Événement input
editor.dom.addEventListener("input", updatePreview);


function redirections(){
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