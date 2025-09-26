// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
use std::fs;
use std::path::Path;
use std::collections::HashMap;
use serde_json::Value;
use std::io::Write;
use std::process::Stdio;
use tauri::command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
