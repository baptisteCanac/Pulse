// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
use std::fs;
use std::path::Path;
use std::collections::HashMap;
use serde_json::Value;

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

#[tauri::command]
fn get_code() -> Result<String, String> {
    // Chemin vers ton fichier JSON
    let file_path = "../src/datas/data.json";

    // Lire le fichier JSON
    let content = fs::read_to_string(file_path).map_err(|e| e.to_string())?;

    // Chercher le tableau "recent_files_paths"
    let start_key = "\"recent_files_paths\": [";
    if let Some(start_idx) = content.find(start_key) {
        let rest = &content[start_idx + start_key.len()..];
        if let Some(end_idx) = rest.find(']') {
            let paths_str = &rest[..end_idx];
            // Split sur les virgules et retirer les guillemets et espaces
            if let Some(first_path) = paths_str
                .split(',')
                .map(|s| s.trim().trim_matches('"'))
                .next()
            {
                // Lire le contenu du fichier dont on a récupéré le path
                let file_content = fs::read_to_string(first_path)
                    .map_err(|e| format!("Erreur lecture du fichier {} : {}", first_path, e))?;
                return Ok(file_content);
            }
        }
    }

    Err("recent_files_paths introuvable".into())
}

#[tauri::command]
fn get_presentation_path() -> Result<String, String>{
    // Chemin vers ton fichier JSON
    let file_path = "../src/datas/data.json";

    // Lire le fichier
    let content = fs::read_to_string(file_path).map_err(|e| e.to_string())?;

    // Chercher le tableau "recent_files_titles"
    let start_key = "\"recent_files_paths\": [";
    if let Some(start_idx) = content.find(start_key) {
        let rest = &content[start_idx + start_key.len()..];
        if let Some(end_idx) = rest.find(']') {
            let titles_str = &rest[..end_idx];
            // Split sur les virgules et retirer les guillemets et espaces
            let first_title = titles_str
                .split(',')
                .map(|s| s.trim().trim_matches('"'))
                .next()
                .ok_or("Pas de titre trouvé")?;
            return Ok(first_title.to_string());
        }
    }

    Err("recent_files_titles introuvable".into())
}

#[tauri::command]
fn get_assets_dir() -> String {
    // Ici on renvoie un chemin absolu vers le dossier assets/images
    let assets_path = std::path::Path::new("./src-tauri/assets/images");
    std::fs::create_dir_all(&assets_path).ok(); // créer le dossier s'il n'existe pas
    assets_path.to_string_lossy().to_string()
}

#[tauri::command]
fn copy_image(src: String, dest_dir: String) -> Result<String, String> {
    let src_path = Path::new(&src);
    if !src_path.exists() {
        return Err(format!("Fichier non trouvé: {}", src));
    }
    let file_name = src_path.file_name().unwrap().to_string_lossy();
    let dest_path = Path::new(&dest_dir).join(&*file_name);
    fs::create_dir_all(&dest_dir).map_err(|e| e.to_string())?;
    fs::copy(&src_path, &dest_path).map_err(|e| e.to_string())?;
    Ok(dest_path.to_string_lossy().to_string())
}

#[tauri::command]
fn read_image(path: String) -> Result<Vec<u8>, String> {
    std::fs::read(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_shortcuts() -> Result<HashMap<String, String>, String> {
    // Chemin vers le fichier JSON
    let file_path = "../src/datas/data.json";

    // Lire le contenu du fichier
    let content = fs::read_to_string(file_path).map_err(|e| e.to_string())?;

    // Parser en JSON
    let json: Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    // Récupérer l'objet "shortcuts"
    let shortcuts = json.get("shortcuts")
        .and_then(|s| s.as_object())
        .ok_or("Impossible de trouver 'shortcuts' dans le JSON")?;

    // Convertir en HashMap<String, String>
    let mut map = HashMap::new();
    for (key, value) in shortcuts {
        if let Some(val_str) = value.as_str() {
            map.insert(key.clone(), val_str.to_string());
        }
    }

    Ok(map)
}

#[tauri::command]
fn get_theme() -> Result<String, String> {
    // Chemin vers le fichier JSON
    let file_path = "../src/datas/data.json";

    // Lire le contenu du fichier
    let content = fs::read_to_string(file_path).map_err(|e| e.to_string())?;

    // Parser en JSON
    let json: Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    // Extraire "theme" en String
    let theme = json.get("theme")
        .and_then(|t| t.as_str())
        .ok_or("Impossible de trouver 'theme' dans le JSON")?;

    Ok(theme.to_string())
}

#[tauri::command]
fn get_version() -> Result<String, String> {
    // Chemin vers le fichier JSON
    let file_path = "../src/datas/data.json";

    // Lire le contenu du fichier
    let content = fs::read_to_string(file_path).map_err(|e| e.to_string())?;

    // Parser en JSON
    let json: Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    // Extraire "theme" en String
    let theme = json.get("version")
        .and_then(|t| t.as_str())
        .ok_or("Impossible de trouver 'theme' dans le JSON")?;

    Ok(theme.to_string())
}

#[tauri::command]
fn set_theme(new_theme: i32) -> Result<(), String> {
    // Chemin vers ton fichier JSON
    let file_path = "../src/datas/data.json";

    // Lire le fichier
    let content = fs::read_to_string(file_path)
        .map_err(|e| format!("Erreur de lecture du fichier: {}", e))?;

    // Parser le JSON
    let mut json: Value = serde_json::from_str(&content)
        .map_err(|e| format!("Erreur parsing JSON: {}", e))?;

    // Modifier la valeur du thème
    if let Some(obj) = json.as_object_mut() {
        obj.insert("theme".to_string(), Value::String(new_theme.to_string()));
    } else {
        return Err("JSON root n'est pas un objet".into());
    }

    // Convertir en String avec indentation
    let new_content = serde_json::to_string_pretty(&json)
        .map_err(|e| format!("Erreur de conversion JSON: {}", e))?;

    // Réécrire dans le fichier
    fs::write(file_path, new_content)
        .map_err(|e| format!("Erreur d'écriture dans le fichier: {}", e))?;

    Ok(())
}

#[tauri::command]
fn get_md_starter() -> Result<String, String> {
    // Chemin vers le fichier Markdown
    let file_path = "../src/datas/mdStarter.md";

    // Lire le contenu du fichier
    let content = fs::read_to_string(file_path)
        .map_err(|e| format!("Erreur lecture du fichier {} : {}", file_path, e))?;

    Ok(content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            select_file,
            new_recent_file,
            get_code,
            get_presentation_path,
            copy_image,
            get_assets_dir,
            read_image,
            get_shortcuts,
            get_theme,
            set_theme,
            get_version,
            get_md_starter
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
