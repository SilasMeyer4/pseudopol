use futures_util::{SinkExt, StreamExt};
use std::sync::{Arc, Mutex};
use tauri::http::Uri;
use tauri::{command, State};
use tokio::net::{TcpListener, TcpStream};
use tokio_websockets::{ClientBuilder, Error, Message, ServerBuilder, WebSocketStream};

pub struct Websocket {
    ws_stream: WebSocketStream<TcpStream>,
}

pub struct WebsocketState {
    socket: Arc<Mutex<Websocket>>,
}

pub async fn start_websocket_server(ip: String, port: String) -> Result<(), Error> {
  //  "127.0.0.1:3000"
    let ip_port = ip + ":" + &port;

    println!("Your ip and port{}", ip_port);
    let listener = TcpListener::bind(ip_port)
        .await
        .expect("Error binding to port");

    tokio::spawn(async move {
        while let Ok((stream, _)) = listener.accept().await {
            let (_resquest, mut ws_stream) = ServerBuilder::new()
                .accept(stream)
                .await
                .expect("Error accepting WebSocket connection");

            tokio::spawn(async move {
                while let Some(Ok(msg)) = ws_stream.next().await {
                    if msg.is_text() || msg.is_binary() {
                        ws_stream
                            .send(Message::text(
                                String::from("Rust says hello") + msg.as_text().unwrap(),
                            ))
                            .await
                            .expect("Error sending response");
                    }
                }

                Ok::<_, Error>(())
            });
        }
        Ok::<_, Error>(())
    });
    Ok(())
}

// #[tauri::command] Job of Frontend
// pub async fn send_message_to_websocket(uri: &Uri, message: &str) -> Result<(), Error> {
//     let ws_stream = WebSocketStream::connect(uri).await.expect("Error connecting to WebSocket");
//     let mut locked_websocket = websocket.lock().await.unwrap();

//     if locked_websocket.ws_stream.is_none() {
//         locked_websocket.ws_stream = Some(ws_stream);
//     }

//     locked_websocket.ws_stream.as_mut().unwrap().send(Message::text(message)).await.expect("Error sending message to WebSocket");

//     ok(())
// }
