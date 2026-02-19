// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// https://www.youtube.com/watch?v=BGm0SCfY5Ak

use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use serde::Serialize;
use std::fs;
use std::fs::OpenOptions; // file access with read and write amd append
use std::io::Write;


#[tauri::command]
fn save_code_text(code_text: &str, file_name: &str) -> String {
    let file_name: String = file_name.to_string();
    let output_text: String = code_text.to_string();

    let mut file: fs::File = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&file_name)
        .expect("Could not open file");

    file.write(output_text.as_bytes())
        .expect("Could not save.");

    let output: String = format!(
        "Last saved {}",
        chrono::Local::now().format("%H:%M:%S")
    );
    // Code last saved at 10:08:46
    return output;
}


// #[tauri::command]
// fn get_file_content(file_path: String) -> String {
//     let file: String = file_path;
//     let bytes = std::fs::read(file).expect("Could not read file");
//     let content = STANDARD.encode(bytes);
//     return content;
// }

#[tauri::command]
fn get_file_content(file_path: String) -> Result<String, String> {
    std::fs::read_to_string(&file_path).map_err(|e| e.to_string())
}


#[tauri::command]
fn get_os() -> String {
    std::env::consts::OS.to_string()
}

#[derive(Serialize)]
struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
}


#[tauri::command]
fn kill_app() {
    std::process::exit(0);
}


#[tauri::command]
fn list_dir(path: String) -> Result<Vec<DirEntry>, String> {
    let entries = fs::read_dir(&path).map_err(|e| e.to_string())?;

    let mut result = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let metadata = entry.metadata().map_err(|e| e.to_string())?;

        result.push(DirEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: path.to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
        });
    }

    Ok(result)
}


#[tauri::command]
fn start_terminal(path: &str) {
    let os: String = get_os();
    if os == "windows" {
        std::process::Command::new("cmd")
            .arg("/C")
            .arg(format!("start cmd /K cd {}", path))
            .spawn()
            .expect("Failed to open terminal");
    }
    if os == "linux" {
        std::process::Command::new("gnome-terminal")
            .arg("--working-directory")
            .arg(path)
            .spawn()
            .expect("Failed to open terminal");
    }
    if os == "macos" {
        std::process::Command::new("open")
            .arg("-a")
            .arg("Terminal")
            .arg(path)
            .spawn()
            .expect("Failed to open terminal");
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            save_code_text,
            get_file_content,
            list_dir,
            kill_app,
            get_os,
            start_terminal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
