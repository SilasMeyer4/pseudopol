use std::sync::Arc;
use std::process::Command;

#[tauri::command]
pub async fn launch_game(path: String) {
    let process = std::process::Command::new(path)
                                .output()
                                .ok()
                                .expect("Failed to execute");
}