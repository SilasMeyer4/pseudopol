<template>
    <div>
        <div id="chat_container" class="chat-container" ref="chat_container">
            
        </div>

        <textarea name="" id="" placeholder="Message..." v-model="input_field"></textarea>
        <button @click="send_message">Send</button>
    </div>
</template>
  
  
  <script setup lang="ts">
    import { sendMessageToWebsocket, getPublicIP } from "./network/client";
    import { nextTick, ref } from "vue";
    import { invoke } from "@tauri-apps/api/core";
    import Test from "./components/Test.vue";

    const chat_container = ref<HTMLElement>();
    const input_field = ref<string>("");
     
    const send_message = ( async () => {
        const message = input_field.value;
        const messageContainer = document.createElement("div");
        messageContainer.className = "sender-message";
        messageContainer.innerHTML = `${message}`;
        chat_container.value?.appendChild(messageContainer);
        sendMessageToWebsocket(message);
        getPublicIP(); //testing getting ip

        let ip = await invoke("get_public_ip");
        console.log("Public IP from rust:", ip);

        nextTick(() => {
            if (chat_container.value) 
            {
                chat_container.value.scrollTop = chat_container.value?.scrollHeight;
            } 
        });

    });

    const receive_message = (() => {


    });

  </script>
  
  <style scoped>

  </style>
  <style>
      .sender-message{
        border: 4px solid red;
        border-radius: 4px;
        align-items: self-start;
    }

    .chat-container{
        max-height: 600px;
        overflow: scroll;
    }
  </style>