use std::fmt::format;
use std::process::Command;
use std::sync::Arc;
use std::time::{Duration, Instant};

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
pub async fn launch_game(path: String) -> Result<u64, String> {
    let now = Instant::now();

    let mut child = std::process::Command::new(path)
        .spawn()
        .map_err(|e| format!("Failed to execute: {}", e))?;

    let status = child
        .wait()
        .map_err(|e| format!("Child got abandon: {}", e))?;

    match status.code() {
        Some(code) => {
            println!("Closed with {} {}", code, now.elapsed().as_secs());
        }
        None => {
            println!("Closed by signal")
        }
    }

    Ok(now.elapsed().as_secs())
}
