<template>
  <!-- Settings button, shown when not in main or settings menu -->
  <div
    class="settings-button-div"
    v-if="currentTab !== Menu.MAIN && currentTab !== Menu.SETTINGS"
  >
    <v-btn class="settings-button" @click="openSettings"
      ><font-awesome-icon :icon="['fas', 'gear']"
    /></v-btn>
  </div>

  <!-- Main menu buttons -->
  <v-container class="menu-buttons" v-if="currentTab === Menu.MAIN">
    <v-btn block @click="enterSinglePlayer">Single Player</v-btn>
    <v-btn block @click="hostLobby">Host</v-btn>
    <v-btn block @click="joinDialog = true">Join</v-btn>
    <v-btn block @click="openSettings">Settings</v-btn>
    <v-btn block @click="exitDialog = true">Exit</v-btn>
  </v-container>

  <!-- Lobby and settings menus -->
  <LobbyMenu
    v-if="currentTab === Menu.LOBBY"
    :playerInfo="playerInfo"
  ></LobbyMenu>
  <SettingsMenu v-if="currentTab === Menu.SETTINGS"></SettingsMenu>

  <!-- Back button, shown when not in main menu -->
  <div class="back-button-div" v-if="currentTab !== Menu.MAIN">
    <v-btn @click="backToLastMenu" class="back-btn"
      ><font-awesome-icon :icon="['fas', 'arrow-left']" /> Back</v-btn
    >
  </div>

  <!-- Join server dialog -->
  <v-dialog v-model="joinDialog" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h6">Enter Server Data</v-card-title>
      <v-card-text>
        <v-text-field
          label="IP4-Adress"
          v-model="ipInputValue"
          :rules="[ipv4Rule]"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="tryJoining">OK</v-btn>
        <v-btn text @click="joinDialog = false">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Exit application dialog -->
  <v-dialog v-model="exitDialog" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h6">Warning</v-card-title>
      <v-card-text>
        Are you sure you want to close the application?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeApplication">OK</v-btn>
        <v-btn text @click="exitDialog = false">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Back/close server dialog -->
  <v-dialog v-model="backDialog" persistent max-width="400">
    <v-card>
      <v-card-title class="text-h6">Warning</v-card-title>
      <v-card-text> Are you sure you want to close your server? </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="
            playerInfo.isHost = false;
            backToLastMenu();
          "
          >OK</v-btn
        >
        <v-btn text @click="backDialog = false">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { onMounted, ref } from "vue";
import LobbyMenu from "./LobbyMenu.vue";
import SettingsMenu from "./SettingsMenu.vue";
import { Menu, PlayerInfo } from "./MenuData";

// Dialog state for join server dialog
const joinDialog = ref(false);
// Input value for IP address
const ipInputValue = ref("");

// Dialog state for exit and back dialogs
const exitDialog = ref(false);
const backDialog = ref(false);

// Current menu tab
const currentTab = ref<Menu>(Menu.MAIN);
// History stack for menu navigation
const menuHistory: Menu[] = [];
// Player information for lobby and game state
const playerInfo = ref<PlayerInfo>({
  maxPlayers: 1,
  isSinglePlayer: true,
  isHost: false,
});

onMounted(async () => {});

/**
 * Handles joining a server: closes dialog, updates player info, and navigates to lobby.
 */
const tryJoining = () => {
  joinDialog.value = false;

  menuHistory.push(currentTab.value);
  playerInfo.value.isSinglePlayer = false;
  playerInfo.value.maxPlayers = 0;
  playerInfo.value.isHost = false;

  currentTab.value = Menu.LOBBY;
};

/**
 * Rule for validating IPv4 addresses in the join dialog.
 */
const ipv4Rule = (input: string) =>
  new RegExp("^(\\d{1,3}\\.){3}\\d{1,3}$").test(input)
    ? true
    : "Invalid IP-Address";

// Keyboard shortcut: Alt+O toggles settings menu
window.addEventListener("keydown", (event) => {
  const isAltO = event.altKey && event.key === "o";
  if (isAltO) {
    event.preventDefault();

    if (currentTab.value !== Menu.SETTINGS) {
      openSettings();
    } else {
      backToLastMenu();
    }
  }
});

/**
 * Enters single player mode and navigates to lobby.
 */
const enterSinglePlayer = () => {
  menuHistory.push(currentTab.value);
  playerInfo.value.isSinglePlayer = true;
  playerInfo.value.maxPlayers = 1;
  playerInfo.value.isHost = false;

  currentTab.value = Menu.LOBBY;
};

/**
 * Opens the settings menu and pushes current tab to history.
 */
const openSettings = () => {
  menuHistory.push(currentTab.value);
  currentTab.value = Menu.SETTINGS;
};

/**
 * Hosts a new lobby and navigates to lobby menu.
 */
const hostLobby = async () => {
  //await invoke("connect_websocket");
  menuHistory.push(currentTab.value);
  playerInfo.value.isSinglePlayer = false;
  playerInfo.value.maxPlayers = 4;
  playerInfo.value.isHost = true;

  currentTab.value = Menu.LOBBY;
};

/**
 * Navigates back to the previous menu, or shows dialog if host.
 */
const backToLastMenu = async () => {
  if (playerInfo.value.isHost) {
    backDialog.value = true;
  } else {
    backDialog.value = false;
    currentTab.value = menuHistory.pop() ?? Menu.MAIN;
  }
};

/**
 * Closes the application by invoking the backend.
 */
const closeApplication = async () => {
  invoke("exit_application");
};
</script>

<style scoped>
.game-selector {
  max-height: 500px; /* Maximale Höhe des Containers */
  overflow-x: auto; /* Vertikales Scrollen aktivieren */
}

.game-row {
  display: flex;
  flex-wrap: wrap; /* Zeilenumbruch bei Überlauf */
  gap: 16px; /* Abstand zwischen den Karten */
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
<style></style>
