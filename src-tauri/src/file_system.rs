use std::path::{Path, PathBuf};

use windows_icons::get_icon_by_path;

#[tauri::command]
pub async fn get_icon_from_file_path(
    path: String,
    folder_path: String,
    name: String,
) -> Result<(), String> {
    let icon_path = PathBuf::from(&path);
    let mut save_path = PathBuf::from(folder_path);
    save_path.push("games");
    save_path.push("icons");

    std::fs::create_dir_all(&save_path).map_err(|e| e.to_string())?;
    println!("{name}.png");
    save_path.push(format!("{name}.png"));
    let icon = get_icon_by_path(icon_path).map_err(|e| e.to_string())?;
    icon.save(&save_path).map_err(|e| e.to_string())?;

    Ok(())
}
