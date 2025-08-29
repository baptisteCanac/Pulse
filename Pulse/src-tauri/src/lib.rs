// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;


#[tauri::command]
fn select_file(script_path: &str) -> Result<String, String> {
    // Lancer le script Python
    let output = Command::new("python3") // ou "python" selon ton OS
        .arg(script_path)
        .output()
        .map_err(|e| e.to_string())?;

    // Récupérer stdout et stderr
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur : {}", stderr);
    }

    if stdout.is_empty() {
        Err("Aucun fichier sélectionné".into())
    } else {
        Ok(stdout)
    }
}

#[tauri::command]
fn new_recent_file(new_recent_file_path: &str) -> Result<String, String> {
    // Chemin vers ton script Python
    let script_path = "../src/scripts/new_recent_file.py";

    // Récupérer le chemin absolu du fichier Rust actuel
    let rust_file_path = std::env::current_dir()
        .map(|p| p.join("src-tauri/src/lib.rs")) // par exemple
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())?;

    // Lancer le script Python avec les deux paramètres
    let output = Command::new("python3")
        .arg(script_path)
        .arg(new_recent_file_path)  // premier paramètre : path du fichier récent
        .arg(rust_file_path)        // deuxième paramètre : chemin du fichier Rust
        .output()
        .map_err(|e| e.to_string())?;

    // Récupérer stdout et stderr
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur : {}", stderr);
    }

    if stdout.is_empty() {
        Err("Aucune sortie du script".into())
    } else {
        Ok(stdout)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            select_file,       // commande existante
            new_recent_file    // ta nouvelle commande
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
