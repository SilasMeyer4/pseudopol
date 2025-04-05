// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod network;
use crate::network::websocket::start_websocket_server;
use crate::network::online::get_public_ip;


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_public_ip,
            ])
        .setup(|app| {
             websocket_init(app); // Initialize the WebSocket plugin for Tauri
             
             Ok(())



         })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn websocket_init(_app: &mut tauri::App) {
    tauri::async_runtime::spawn(start_websocket_server());   
}
