const { invoke } = window.__TAURI__.core;

import MarkdownParser from "../lib/MarkdownParser.js";
import ColorMode from "../lib/ColorMode.js";

async function codeTraitement(){
    const markdownParser = new MarkdownParser(invoke);
    const container = document.getElementById("container");

    let code = await invoke("get_code");
    code = await markdownParser.parseAll(code);

    container.innerHTML = code;
}

codeTraitement();