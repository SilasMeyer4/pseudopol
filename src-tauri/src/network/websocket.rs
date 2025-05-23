use futures_util::{SinkExt};
use std::sync::Arc;
use tokio::net::{TcpStream};
use tokio::sync::Mutex;
use tokio_tungstenite::{MaybeTlsStream};
use tokio_tungstenite::{
    connect_async, tungstenite::protocol::Message, tungstenite::Error, WebSocketStream,
};

pub struct WebsocketState {
    socket: Arc<Mutex<Option<WebsocketConnection>>>,
}

pub enum WebsocketConnection {
    Basic(WebSocketStream<MaybeTlsStream<TcpStream>>),
}

impl WebsocketState {
    #[allow(dead_code)]
    pub fn new() -> Self {
        WebsocketState {
            socket: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn connect(&self) -> Result<(), Error> {
        let mut lock = self.socket.lock().await;
        if lock.is_none() {
            let (stream, _) = connect_async("ws://127.0.0.1:8080").await?;
            *lock = Some(WebsocketConnection::Basic(stream));
            println!("WebSocket connected");
        } else {
            println!("WebSocket already connected");
        }
        Ok(())
    }

    pub async fn close(&self) -> Result<(), Error> {
        let mut lock = self.socket.lock().await;
        if let Some(WebsocketConnection::Basic(stream)) = lock.as_mut() {
            stream.close(None).await?;
            println!("WebSocket connection closed");
            *lock = None;
        } else {
            println!("No active connection to close");
        }
        Ok(())
    }

    pub async fn send_message(&self, message: &str) -> Result<(), Error> {
        let mut lock = self.socket.lock().await;
        if let Some(WebsocketConnection::Basic(stream)) = lock.as_mut() {
            stream.send(Message::Text(message.into())).await?;
            println!("Sent message: {}", message);
        } else {
            println!("WebSocket not connected");
        }
        Ok(())
    }
}

#[tauri::command]
pub async fn connect_websocket(state: tauri::State<'_, WebsocketState>) -> Result<(), String> {
    state.connect().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn send_message(
    state: tauri::State<'_, WebsocketState>,
    message: String,
) -> Result<(), String> {
    state
        .send_message(&message)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn close_websocket(state: tauri::State<'_, WebsocketState>) -> Result<(), String> {
    state.close().await.map_err(|e| e.to_string())
}
