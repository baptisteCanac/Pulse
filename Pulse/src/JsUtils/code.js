import { EditorView, basicSetup } from "https://esm.sh/@codemirror/basic-setup";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown";
import MarkdownParser from "./MarkdownParser.js"; // chemin vers ton parseur

const editorParent = document.getElementById("editor");
const previewParent = document.getElementById("preview");

// Dummy invoke
async function invoke(cmd, args) {
  if (cmd === "read_image") return new Uint8Array();
  return null;
}

const parser = new MarkdownParser(invoke);

// CodeMirror light mode
const editor = new EditorView({
  doc: "# Titre 1\n## Titre 2\n\n- Item 1\n- Item 2\n\n`Code inline`",
  extensions: [basicSetup, markdown()],
  parent: editorParent,
});

// Mettre à jour la preview
async function updatePreview() {
  const mdContent = editor.state.doc.toString();
  const html = await parser.parseAll(mdContent, "/dummy/path");
  previewParent.innerHTML = html;
}

// Événement input
editor.dom.addEventListener("input", updatePreview);

// Affichage initial
updatePreview();