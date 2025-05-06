export let websocket = new WebSocket('ws://localhost:3000');

websocket.onopen = function(event) {
  console.log('Connected to server: ', event);
};


websocket.onmessage = function (event) {
    console.log('Received message from server: ', event.data);
}

websocket.onerror = function (error) {
    console.error('WebSocket error: ', error);
}

websocket.onclose = function (event) {
    console.log('Connection closed: ', event);
}

export function sendMessageToWebsocket(message: string) {
    if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(message);
        console.log('Sent message to server: ', message);
    } else {
        console.error('WebSocket is not open, cannot send message.');
    }
}


export async function getPublicIP(): Promise<string> {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('Your public IP address is:', data.ip);
        return data.ip;
    } catch (error) {
        console.error('Error fetching public IP: ', error);
        return '';
    }
}