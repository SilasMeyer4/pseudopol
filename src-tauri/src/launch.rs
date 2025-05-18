use std::sync::Arc;
use std::process::Command;



/// Erstellt einen neuen Benutzer.
///
/// # Argumente
///
/// * `name` - Der Name des Benutzers
/// * `alter` - Das Alter des Benutzers
///
/// # Rückgabe
///
/// Gibt eine Instanz von `Benutzer` zurück.
#[tauri::command]
pub async fn launch_game(path: String) {
    let process = std::process::Command::new(path)
                                .output()
                                .ok()
                                .expect("Failed to execute");
}