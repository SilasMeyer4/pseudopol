<template>
    <div class="settings-button-div" v-if="currentTab !== Menu.MAIN && currentTab !== Menu.SETTINGS">
      <v-btn class="settings-button" @click="open_settings"><font-awesome-icon :icon="['fas', 'gear']" /></v-btn>
    </div>
    <v-container class="menu-buttons" v-if="currentTab === Menu.MAIN">
        <v-btn block>Single Player</v-btn>
        <v-btn block @click="host_lobby">Host</v-btn>
        <v-btn block @click="join_lobby">Join</v-btn>
        <v-btn block @click="open_settings">Settings</v-btn>
        <v-btn block @click="close_application">Exit</v-btn>
        
    </v-container>

    <LobbyMenu v-if="currentTab === Menu.LOBBY" :props="currentTab"></LobbyMenu>
    <SettingsMenu v-if="currentTab === Menu.SETTINGS"></SettingsMenu>

    <v-btn v-if="currentTab !== Menu.MAIN" @click="back_to_last_menu">Back</v-btn>

  </template>
  
  
  <script setup lang="ts">
    import { invoke } from '@tauri-apps/api/core';
    import { ask } from '@tauri-apps/plugin-dialog';
    import { ref } from 'vue';
    import LobbyMenu from './LobbyMenu.vue';
    import SettingsMenu from './SettingsMenu.vue';


enum Menu {
    MAIN,
    LOBBY,
    SETTINGS
}

const currentTab = ref<Menu>(Menu.MAIN);
const menuHistory: Menu[] = [];



const open_settings = (()=> {
  menuHistory.push(currentTab.value);
    currentTab.value = Menu.SETTINGS
});

const host_lobby = (async() => {
    //await invoke("connect_websocket");
    menuHistory.push(currentTab.value);
    currentTab.value = Menu.LOBBY;
});

const join_lobby = (() => {
    menuHistory.push(currentTab.value);
    currentTab.value = Menu.LOBBY;
});

const back_to_last_menu = (() => {
    currentTab.value = menuHistory.pop() ?? Menu.MAIN;
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
.game-selector {
  max-height: 500px; /* Maximale Höhe des Containers */
  overflow-x: auto;  /* Vertikales Scrollen aktivieren */
}

.game-row {
  display: flex;
  flex-wrap: wrap;  /* Zeilenumbruch bei Überlauf */
  gap: 16px;        /* Abstand zwischen den Karten */
}

v-col {
  padding: 0; /* Entfernt den Standardabstand */
}

v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

v-card-title, v-card-subtitle {
  text-align: center;
}

.settings-button-div {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1; /* Ensures it stays on top */
}

.settings-button {
  background-color: rgba(34, 34, 34, 0.2);
  color: white;
  size: 10px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Adds spacing between buttons */
  width: 100%;
}
  </style>
  <style>

  </style>