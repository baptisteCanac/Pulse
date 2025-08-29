const { invoke } = window.__TAURI__.core;

const content = await invoke("get_code");
console.log(content);