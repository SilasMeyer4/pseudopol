// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod network;
use crate::network::online::{get_public_ip, start_server};
use crate::network::websocket::start_websocket_server;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_public_ip,
            exit_application,
            start_server,

        ])
        .setup(|app| {

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn exit_application(app_handle: tauri::AppHandle) {
    app_handle.exit(0);
}
