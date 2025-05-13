<template>
    <div v-if="currentTab === Menu.MAIN">
        <v-btn>Single Player</v-btn>
        <v-btn @click="host_lobby">Host</v-btn>
        <v-btn @click="join_lobby">Join</v-btn>
        <v-btn @click="close_application">Exit</v-btn>
    </div>

    <LobbyMenu v-if="Menu.LOBBY" :props="currentTab"></LobbyMenu>

    <v-btn v-if="currentTab !== Menu.MAIN" @click="back_to_last_menu">Back</v-btn>

  </template>
  
  
  <script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { ask } from '@tauri-apps/plugin-dialog';
import { ref } from 'vue';
import LobbyMenu from './LobbyMenu.vue';


enum Menu {
    MAIN,
    LOBBY,
}
const currentTab = ref<Menu>(Menu.MAIN);

const host_lobby = (async() => {
    await invoke("connect_websocket");

    currentTab.value = Menu.LOBBY;
});

const join_lobby = (() => {
    currentTab.value = Menu.LOBBY;
});

const back_to_last_menu = (() => {
    currentTab.value = Menu.MAIN;
});


    const close_application = (async() => {

        const answer = await ask("Are you sure you want to close the application?", {
            title: "Close",
            kind: "warning"
        });

        if (answer) {
            invoke("exit_application");
        }

       
    });
  </script>
  
  <style scoped>

  </style>
  <style>

  </style>