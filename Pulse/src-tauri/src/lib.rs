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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![select_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
