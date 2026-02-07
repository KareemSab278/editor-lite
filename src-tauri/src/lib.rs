// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// https://www.youtube.com/watch?v=BGm0SCfY5Ak

#[tauri::command]
fn save_code_text(code_text: &str) -> String {
    // i need to save file when hittin ctrl + s and save new file when hitting ctrl + shift + s
    format!("saved code {}...", code_text.chars().take(10).collect::<String>()) // In a real app, you would save the code text to a file or database here
    // reduce the code text to the first 10 characters for display purposes

    // i figured this part out before using my downloads_logger. it could write to file easily.
    // example code:
    //     pub fn add_log(log: String) {
    //     let file_name: String = "folder_logger.txt".to_string();

    //     let output_text = format!("[{}] {}\n", get_current_date_time(), log); // looks like: [2026-01-25 19:34:15] text

    //     let mut file = OpenOptions::new()
    //         .create(true)
    //         .append(true)
    //         .open(file_name)
    //         .expect("Could not open file");

    //     file.write(output_text.as_bytes()).expect("Could not write to file brev");
    // }
}

// i need to show all files when hitting ctrl + F + E
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
        .invoke_handler(tauri::generate_handler![save_code_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
