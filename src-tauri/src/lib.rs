// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// https://www.youtube.com/watch?v=BGm0SCfY5Ak

use std::fs::OpenOptions; // file access with read and write amd append
use std::io::Write;
use std::fs;
use serde::Serialize;

#[tauri::command]
fn save_code_text(code_text: &str, file_name: &str) -> String {
    // i need to save file when hittin ctrl + s and save new file when hitting ctrl + shift + s
    // reduce the code text to the first 10 characters for display purposes

    // i figured this part out before using my downloads_logger. it could write to file easily.
    // example code:
    let file_name: String = file_name.to_string();
    let output_text: String = code_text.to_string();

    let mut file = OpenOptions::new()
        .create(true)
        .write(true) // overwrite existing content
        .truncate(true)
        .open(file_name)
        .expect("Could not open file");

    file.write(output_text.as_bytes()).expect("Could not write to file.");

    let output: String = format!("saved code {}...", code_text.chars().take(10).collect::<String>()); // In a real app, you would save the code text to a file or database here
    return output;
}

#[tauri::command]
fn get_file_content(file_path: String) -> String {
    // read the content of the file and return it as a string
    // open file selector and get the file path and then read the file and return the content to the frontend as txt plain
    let file: String = file_path;
    let content = std::fs::read_to_string(file).expect("Could not read file");
    return content;
}

#[derive(Serialize)]
struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
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


// i need to show all files when hitting ctrl + E
// fn ls_files() // will show a file explorer to select which file to open and then read the file and return the content to the frontend as txt plain
// then set state of code to the content of the file

// i need to have an undo and redo feature but i think html textarea has that built in so i can just use that and then save the content of the textarea to a file when hitting ctrl + s

// i also need some features like opening a terminal in the same dir as file open using ctrl + j

// ill need to show all files in dir on left but i dont think i want to to ensure a clutter free experience...
// so just the command to open file explorer in same dir and whenselect new file it oepns new tab. so i need to inc tabs in front...

// ctrl + w to close tabs with save modal prompt. (unless 0 tabs then just close tab without save modal prompt and dont save )
// ctrl + q to terminate program with save modal prompt.
// ctrl + q + ! to close tab without save modal prompt and dont save.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_code_text, get_file_content, list_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
