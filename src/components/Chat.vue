<template>
  <v-container class="chat-box">
    <!-- Chat message display area -->
    <div class="chat-container" ref="chatContainer">
      <v-card
        v-for="(msg, index) in messages"
        :key="index"
        class="chat-message"
        :class="msg.from === 'Me' ? 'sender-message' : 'receiver-message'"
      >
        <v-card-title class="text-subtitle-2">
          {{ msg.from }}
        </v-card-title>
        <v-card-text>{{ msg.message }}</v-card-text>
      </v-card>
    </div>

    <!-- Input area for sending messages -->
    <div class="chat-input">
      <textarea
        name=""
        id=""
        placeholder="Message..."
        v-model="inputField"
      ></textarea>
      <v-btn @click="sendMessage">Send</v-btn>
      <!-- Button for testing receiving a message -->
      <v-btn @click="receiveMessage({ from: 'Somone', message: 'TestMessage' })"
        >receive test</v-btn
      >
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { sendMessageToWebsocket } from "./network/client";
import { invoke } from "@tauri-apps/api/core";
/**
 * Type for a chat message.
 * @property from - The sender of the message.
 * @property message - The message content.
 */
type Message = { from: string; message: string };

// Reference to the chat container DOM element for scrolling
const chatContainer = ref<HTMLElement>();
// The current value of the input field
const inputField = ref<string>("");
// List of all chat messages
const messages = ref<Message[]>([]);

/**
 * Sends a message from the user.
 * - Adds the message to the chat
 * - Sends a message to the websocket
 * - Gets the public IP from Rust backend (for demonstration)
 * - Scrolls chat to bottom
 */
const sendMessage = async () => {
  if (!inputField.value.trim()) return;
  const myMessage: Message = { from: "Me", message: inputField.value };
  messages.value.push(myMessage);
  inputField.value = "";

  sendMessageToWebsocket("wiw");

  // Example: get public IP from Rust backend
  let ip = await invoke("get_public_ip");
  console.log("Public IP from rust:", ip);

  scrollChatDown();
};

/**
 * Receives a message and adds it to the chat.
 * @param message - The message to add
 */
const receiveMessage = async (message: Message) => {
  messages.value.push(message);
  scrollChatDown();
};

/**
 * Scrolls the chat container to the bottom after DOM update.
 */
const scrollChatDown = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value?.scrollHeight;
    }
  });
};
</script>

<style scoped></style>
<style>
.chat-box {
  max-height: 600px;
  height: 60vh;
  padding: 16px;
  height: 100vh; /* oder z. B. 600px wenn du's begrenzen willst */
}

.chat-container {
  flex: 1;
  overflow-y: auto; /* Jetzt hier scrollbar */

  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
  max-height: 100%; /* damit es flexibles scrollen erlaubt */
  background-color: #434343;
  border-radius: 8px;
  min-height: 0; /* wichtig für korrektes flex scrollen */
  min-height: 500px;
}

.chat-message {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
}

.sender-message {
  align-self: flex-end;
  background-color: #1976d2 !important;
  color: white !important;
}

.sender-message .v-card__title,
.sender-message .v-card__text {
  color: white !important;
  background-color: transparent !important; /* prevent inner bg override */
}

.receiver-message {
  align-self: flex-start;
  background-color: #e0e0e0 !important;
  color: black !important;
}

.receiver-message .v-card__title,
.receiver-message .v-card__text {
  color: black !important;
  background-color: transparent !important;
}

.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.chat-input textarea {
  flex: 1;
  resize: none;
  min-height: 40px;
  max-height: 100px;
  padding: 8px;
  border-radius: 6px;
  background-color: #434343;
}
/* Optional: bessere Darstellung für Buttons */
.chat-input .v-btn {
  height: 40px;
}
</style>
