use serde::Serialize;
use std::fs;
use std::fs::OpenOptions;
use std::io::Write;

// when using Result enum you should add .map_err(|e| e.to_string()) to the end of the function call
// to convert the error to a string for easier handling in the frontend to see the error message and the app wont die and panic
#[tauri::command]
fn save_code_text(code_text: &str, file_name: &str) -> Result<String, String> {
    let file_name: String = file_name.to_string();
    let output_text: String = code_text.to_string();

    let mut file: fs::File = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&file_name)
        .map_err(|e| e.to_string())?;

    file.write_all(output_text.as_bytes())
        .map_err(|e| e.to_string())?;

    let output: String = format!(
        "Last saved {}",
        chrono::Local::now().format("%H:%M:%S")
    );

    Ok(output)
}

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
fn start_terminal(path: &str) -> Result<String, String> {
    let os: String = get_os();
    if os == "windows" {
        std::process::Command::new("cmd")
            .arg("/C")
            .arg(format!("start cmd /K cd {}", path))
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    if os == "linux" {
        std::process::Command::new("gnome-terminal")
            .arg("--working-directory")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    if os == "macos" {
        std::process::Command::new("open")
            .arg("-a")
            .arg("Terminal")
            .arg(path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    Ok("Terminal opened successfully".to_string())
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
