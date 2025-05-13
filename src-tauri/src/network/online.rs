#[tauri::command]
pub async fn get_public_ip() -> Result<String, String> {
    let response = reqwest::get("https://api.ipify.org")
        .await
        .map_err(|e| e.to_string())?;

    let ip = response.text().await.map_err(|e| e.to_string())?;

    println!("{}", ip);

    Ok(ip)
}
