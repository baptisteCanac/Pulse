#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{MenuBuilder, SubmenuBuilder},
    Manager,
    Emitter
};
use serde_json::Value;
use std::fs;
use std::process::Command;
use std::path::Path;
use std::collections::HashMap;
use std::io::Write;
use std::process::Stdio;
use tauri::command;

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
fn save_new_language(languageId: i16) -> Result<String, String> {
    let output = Command::new("python3") // ou "python" selon ton OS
        .arg("../src/scripts/save_new_language.py")
        .arg(languageId.to_string())
        .output()
        .map_err(|e| e.to_string())?;

    // Récupérer stdout et stderr
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur : {}", stderr);
    }

    if stdout.is_empty() {
        Err("erreur".into())
    } else {
        Ok(stdout)
    }
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
fn get_md_starter() -> Result<String, String> {
    // Chemin vers le fichier Markdown
    let file_path = "../src/datas/mdStarter.md";

    // Lire le contenu du fichier
    let content = fs::read_to_string(file_path)
        .map_err(|e| format!("Erreur lecture du fichier {} : {}", file_path, e))?;

    Ok(content)
}

#[tauri::command]
fn save_sidebar_state(state: bool) -> Result<String, String>{
    let output = Command::new("python3") // ou "python" selon ton OS
        .arg("../src/scripts/save_sidebar_state.py")
        .arg(state.to_string())
        .output()
        .map_err(|e| e.to_string())?;

    // Récupérer stdout et stderr
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur : {}", stderr);
    }

    if stdout.is_empty() {
        Err("erreur".into())
    } else {
        Ok(stdout)
    }
}

#[tauri::command]
fn create_pdf(format: &str, looper: bool, protect: bool, page_size: &str, parsed_code: &str) -> Result<String, String> {
    let mut child = Command::new("python3")
        .arg("../src/scripts/export.py")
        .arg(format)
        .arg(looper.to_string())
        .arg(protect.to_string())
        .arg(page_size)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    // Écrire le code dans stdin
    if let Some(stdin) = child.stdin.as_mut() {
        stdin.write_all(parsed_code.as_bytes()).map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;

    // Récupérer stdout et stderr
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur Python : {}", stderr);
    }

    if stdout.is_empty() {
        Err("Erreur : aucun retour du script Python".into())
    } else {
        Ok(stdout)  // <-- c'est ce qui manquait
    }
}

#[tauri::command]
fn save_new_shortcuts(shortcuts: HashMap<String, String>) -> Result<String, String>{
    let output = Command::new("python3") // ou "python" selon ton OS
        .arg("../src/scripts/save_new_shortcuts.py")
        .arg(shortcuts["go_home"].clone())
        .arg(shortcuts["open_overlay"].clone())
        .arg(shortcuts["toggle_sidebar"].clone())
        .output()
        .map_err(|e| e.to_string())?;

    // Récupérer stdout et stderr
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur : {}", stderr);
    }

    if stdout.is_empty() {
        Err("erreur".into())
    } else {
        Ok(stdout)
    }
}

#[tauri::command]
fn open_new_file() -> Result<(String, String), String> {
    // 1️⃣ Lancer le script Python pour récupérer le chemin du fichier
    let output = Command::new("python3")
        .arg("../src/scripts/pick_file.py")
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur Python : {}", stderr);
    }

    // 2️⃣ Vérifier que stdout n’est pas vide
    if stdout.is_empty() {
        return Err("Aucun fichier sélectionné".into());
    }

    let choosen_file_path = stdout;

    // 3️⃣ Lire le contenu du fichier choisi
    let file_content = fs::read_to_string(&choosen_file_path)
        .map_err(|e| format!("Erreur lecture fichier : {}", e))?;

    // 4️⃣ Retourner un tuple (chemin, contenu)
    Ok((choosen_file_path, file_content))
}

#[command]
fn create_new_file(text: String) -> Result<String, String> {
    // Lancer le script Python pour créer un nouveau fichier
    let mut child = Command::new("python3")
        .arg("../src/scripts/create_new_file.py")
        .stdin(Stdio::piped())  // on envoie le texte via stdin
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    // Écrire le texte de l'éditeur dans stdin
    if let Some(stdin) = child.stdin.as_mut() {
        stdin.write_all(text.as_bytes()).map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur Python : {}", stderr);
    }

    if stdout.is_empty() {
        Err("Erreur lors de la création du fichier".into())
    } else {
        Ok(stdout)  // Retourne le chemin complet du fichier créé
    }
}

#[command]
fn save_existing_file(path: String, text: String) -> Result<String, String> {
    let mut child = Command::new("python3")
        .arg("../src/scripts/save_existing_file.py")
        .arg(&path)           // uniquement le chemin
        .stdin(Stdio::piped()) // pour envoyer le texte
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    // Écrire le texte dans stdin
    if let Some(stdin) = child.stdin.as_mut() {
        stdin.write_all(text.as_bytes()).map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr);

    if !stderr.is_empty() {
        eprintln!("Erreur Python : {}", stderr);
    }

    if stdout.is_empty() {
        Err("Erreur lors de la sauvegarde".into())
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

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Étape 1 : Créer le sous-menu "About" (requis sur macOS comme premier menu)
            let about_menu = SubmenuBuilder::new(app, "À propos")
                .text("about_app", "À propos de MonApp")
                .separator()
                .text("quit", "Quitter")
                .build()?;

            // Étape 2 : Créer le sous-menu "File" avec vos options personnalisées
            let file_menu = SubmenuBuilder::new(app, "File")
                .text("new_file", "Nouveau fichier")
                .text("open_file", "Ouvrir...")
                .text("save_file", "Enregistrer")
                .text("save_as", "Enregistrer sous...")
                .separator()
                .text("export_pdf", "Exporter en PDF") // Votre option personnalisée
                .text("import_data", "Importer des données") // Autre option personnalisée
                .separator()
                .text("recent_files", "Fichiers récents")
                .build()?;

            // Étape 3 : Créer le sous-menu "Edit" (optionnel)
            let edit_menu = SubmenuBuilder::new(app, "Édition")
                .copy()    // Fonction prédéfinie
                .paste()   // Fonction prédéfinie
                .separator()
                .undo()    // Fonction prédéfinie
                .redo()    // Fonction prédéfinie
                .separator()
                .select_all() // Fonction prédéfinie
                .build()?;

            // Étape 4 : Assembler le menu principal
            let menu = MenuBuilder::new(app)
                .items(&[&about_menu, &file_menu, &edit_menu])
                .build()?;

            // Étape 5 : Appliquer le menu à l'application
            app.set_menu(menu)?;

            // Étape 6 : Gérer les événements de menu
            app.on_menu_event(move |app_handle, event| {
                match event.id().0.as_str() {
                    // Gestion du menu About
                    "about_app" => {
                        println!("À propos cliqué");
                        // Vous pouvez ouvrir une fenêtre de dialogue ici
                    }
                    "quit" => {
                        println!("Quitter l'application");
                        app_handle.exit(0);
                    }
                    
                    // Gestion du menu File
                    "new_file" => {
                        println!("Nouveau fichier demandé");
                        create_new_file_test(app_handle);
                    }
                    "open_file" => {
                        println!("Ouvrir fichier demandé");
                        open_file_dialog(app_handle);
                    }
                    "save_file" => {
                        println!("Enregistrer fichier");
                        save_current_file(app_handle);
                    }
                    "save_as" => {
                        println!("Enregistrer sous");
                        save_file_as(app_handle);
                    }
                    "export_pdf" => {
                        println!("Exporter en PDF demandé");
                        export_to_pdf(app_handle);
                    }
                    "import_data" => {
                        println!("Importer des données");
                        import_data_dialog(app_handle);
                    }
                    "recent_files" => {
                        println!("Fichiers récents");
                        show_recent_files(app_handle);
                    }
                    
                    _ => {
                        println!("Événement de menu non géré: {}", event.id().0);
                    }
                }
            });

            Ok(())
        })
        // ← IMPORTANT: Ajouter vos commandes existantes ici
        .invoke_handler(tauri::generate_handler![
            // Remplacez ces noms par vos vraies commandes de lib.rs
            select_file,
            save_new_language,
            get_theme,
            new_recent_file,
            get_code,
            get_presentation_path,
            copy_image,
            get_assets_dir,
            read_image,
            get_shortcuts,
            set_theme,
            get_version,
            get_md_starter,
            open_new_file,
            save_existing_file,
            create_new_file,
            save_new_shortcuts,
            create_pdf,
            save_sidebar_state
        ])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("Erreur lors du lancement de l'application Tauri");
}

// Fonctions d'exemple pour gérer vos actions personnalisées
fn create_new_file_test(app_handle: &tauri::AppHandle) {
    println!("Création d'un nouveau fichier...");
    app_handle.emit("file-action", "new-file").unwrap();
}

fn open_file_dialog(app_handle: &tauri::AppHandle) {
    println!("Ouverture du dialogue de fichier...");
    app_handle.emit("file-action", "open-file").unwrap();
}

fn save_current_file(app_handle: &tauri::AppHandle) {
    println!("Sauvegarde du fichier courant...");
    app_handle.emit("file-action", "save-file").unwrap();
}

fn save_file_as(app_handle: &tauri::AppHandle) {
    println!("Enregistrer sous...");
    app_handle.emit("file-action", "save-as").unwrap();
}

fn export_to_pdf(app_handle: &tauri::AppHandle) {
    println!("Export PDF en cours...");
    app_handle.emit("file-action", "export-pdf").unwrap();
}

fn import_data_dialog(app_handle: &tauri::AppHandle) {
    println!("Import de données...");
    app_handle.emit("file-action", "import-data").unwrap();
}

fn show_recent_files(app_handle: &tauri::AppHandle) {
    println!("Affichage des fichiers récents...");
    app_handle.emit("file-action", "recent-files").unwrap();
}