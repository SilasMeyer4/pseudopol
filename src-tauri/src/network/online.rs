use reqwest::Error;
use super::websocket::start_websocket_server;

#[tauri::command]
pub async fn get_public_ip() -> Result<String, String> {
    let response = reqwest::get("https://api.ipify.org")
        .await
        .map_err(|e| e.to_string())?;

    let ip = response.text().await.map_err(|e| e.to_string())?;

    println!("{}", ip);

    Ok(ip)
}

#[tauri::command]
pub async fn start_server() -> Result<String, String>{
    let pub_ip = get_public_ip().await;
    match pub_ip {
        Ok(ip) => {
            tauri::async_runtime::spawn(start_websocket_server("0.0.0.0".to_owned(), "5555".to_owned())); //check port
            println!("Started websocket");
        }
        _ => {
            println!("Error");
        }
    } 


    Ok("".to_owned())
}
