<template>
    <div class="settings-button-div" v-if="currentTab !== Menu.MAIN && currentTab !== Menu.SETTINGS">
      <v-btn class="settings-button" @click="open_settings"><font-awesome-icon :icon="['fas', 'gear']" /></v-btn>
    </div>
    <v-container class="menu-buttons" v-if="currentTab === Menu.MAIN">
        <v-btn block @click="enter_single_player">Single Player</v-btn>
        <v-btn block @click="host_lobby">Host</v-btn>
        <v-btn block @click="joinDialog = true">Join</v-btn>
        <v-btn block @click="open_settings">Settings</v-btn>
        <v-btn block @click="exitDialog = true">Exit</v-btn>
        
    </v-container>

    <LobbyMenu v-if="currentTab === Menu.LOBBY" :playerInfo="playerInfo"></LobbyMenu>
    <SettingsMenu v-if="currentTab === Menu.SETTINGS"></SettingsMenu>

    <div class="back-button-div" v-if="currentTab !== Menu.MAIN">
 
        <v-btn @click="back_to_last_menu" class="back-btn"><font-awesome-icon :icon="['fas', 'arrow-left']" /> Back</v-btn>
    </div>



    <!--JOIN BUTTON DIALOG-->
    <v-dialog v-model="joinDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Enter Server Data</v-card-title>
        <v-card-text>
          <v-text-field label="IP4-Adress" v-model="ipInputValue" :rules="[ipv4Rule]" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="joinDialog = false">Abbrechen</v-btn>
          <v-btn text @click="try_joining">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--EXIT BUTTON DIALOG-->
    <v-dialog v-model="exitDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Warning</v-card-title>
        <v-card-text>
           Are you sure you want to close the application?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="exitDialog = false">Abbrechen</v-btn>
          <v-btn text @click="close_application">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--BACK BUTTON DIALOG-->
    <v-dialog v-model="backDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Warning</v-card-title>
        <v-card-text>
           Are you sure you want to close your server?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="backDialog = false">Abbrechen</v-btn>
          <v-btn text @click="playerInfo.isHost = false; back_to_last_menu();">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



  </template>
  
  
  <script setup lang="ts">
    import { invoke } from '@tauri-apps/api/core';
    import { ask } from '@tauri-apps/plugin-dialog';
    import { ref } from 'vue';
    import LobbyMenu from './LobbyMenu.vue';
    import SettingsMenu from './SettingsMenu.vue';
import { Menu, PlayerInfo } from './MenuData';

const joinDialog = ref(false);
const ipInputValue = ref("");

const exitDialog = ref(false);
const backDialog = ref(false);


const currentTab = ref<Menu>(Menu.MAIN);
const menuHistory: Menu[] = [];
const playerInfo = ref<PlayerInfo>({maxPlayers: 1, isSinglePlayer: true, isHost: true});


const try_joining = (() => {
    joinDialog.value = false;
    
    menuHistory.push(currentTab.value);
    playerInfo.value.isSinglePlayer = false;
    playerInfo.value.maxPlayers = 0;
    playerInfo.value.isHost = false;
    

    currentTab.value = Menu.LOBBY;
});

const ipv4Rule = (input: string) => new RegExp("^(\\d{1,3}\\.){3}\\d{1,3}$").test(input) ? true : "Invalid IP-Address"
    


const enter_single_player = (() => {
    menuHistory.push(currentTab.value);
    playerInfo.value.isSinglePlayer = true;
    playerInfo.value.maxPlayers = 1;
    playerInfo.value.isHost = false;



    currentTab.value = Menu.LOBBY
});

const open_settings = (()=> {
    menuHistory.push(currentTab.value);
    currentTab.value = Menu.SETTINGS
});

const host_lobby = (async() => {
    //await invoke("connect_websocket");
    menuHistory.push(currentTab.value);
    playerInfo.value.isSinglePlayer = false;
    playerInfo.value.maxPlayers = 4;
    playerInfo.value.isHost = true;
    
    currentTab.value = Menu.LOBBY;
});



const back_to_last_menu = (async() => {
    if (playerInfo.value.isHost) {
        backDialog.value = true;
    }
    else
    {
        backDialog.value = false
        currentTab.value = menuHistory.pop() ?? Menu.MAIN;
    }
});


    const close_application = (async() => {
            invoke("exit_application");      
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


.settings-button-div {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1; /* Ensures it stays on top */
}

.v-btn {
    background-color: rgba(34, 34, 34, 0.2);
    color: white;
    size: 10px;
}

.back-button-div {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1; /* Ensures it stays on top */
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