<template>
  <!-- Settings menu layout -->
  <v-container fluid class="settings-menu">
    <v-row no-gutters>
      <!-- Sidebar with settings options -->
      <v-col cols="2" class="settings-sidebar">
        <v-list class="settings-list">
          <v-list-item
            v-for="(setting, index) in settings"
            :key="index"
            @click="selectedSetting = setting"
          >
            <div>
              {{ setting }}
            </div>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Main content area for selected setting -->
      <v-col cols="10" class="settings-body">
        <!-- General settings page -->
        <div v-if="selectedSetting === Settings.GENERAL">
          Genral setting page
        </div>

        <!-- Data management page -->
        <v-container v-if="selectedSetting === Settings.DATA" fluid>
          <v-row class="mb-4">
            <v-col cols="12">
              <h3>Data Management</h3>
            </v-col>
          </v-row>

          <v-row>
            <!-- Input for adding a new game -->
            <v-col cols="6">
              <v-text-field
                block
                placeholder="Game Name (free to choose what you want)"
                v-model="addedGameName"
              ></v-text-field>
            </v-col>

            <!-- Button to open file selector for adding a game -->
            <v-col cols="6">
              <v-btn block @click="openGameSelector(addedGameName)"
                >Add Game</v-btn
              >
            </v-col>

            <!-- Dropdown to select a game for deletion -->
            <v-col cols="6">
              <v-select
                v-model="selectedGame"
                :items="gameList"
                item-title="name"
                item-value="name"
                label="Select a game"
                clearable
              />
            </v-col>

            <!-- Button to delete the selected game -->
            <v-col cols="6">
              <v-btn block @click="removeGame(selectedGame)">Delete Game</v-btn>
            </v-col>
          </v-row>
        </v-container>

        <!-- Bug report page -->
        <div v-if="selectedSetting === Settings.BUG">Bug Report page</div>
        <div
          v-if="selectedSetting === Settings.BUG"
          @click="openGitHubIssuePage"
        >
          <v-btn>Report Bug</v-btn>
        </div>
        <v-btn @click="openAppData">Open Local Data</v-btn>

        <!-- About page -->
        <div v-if="selectedSetting === Settings.ABOUT">
          Pseudopol created by Dennis Probst and Silas Meyer
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Dialog for adding new games -->
  <v-dialog v-model="newGamesDialog" persistent max-width="90vw">
    <v-card>
      <v-card-title class="text-h6">Adding Games</v-card-title>
      <v-row v-for="(game, index) in newGames" :key="index">
        <v-col class="game-container">
          {{ game.path }}
          <v-text-field v-model="game.name" label="Name"> </v-text-field>
          <v-checkbox
            v-model="game.isMultiplayer"
            label="Is Multiplayer Game"
            class="dark-checkbox"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="
            newGamesDialog = false;
            addGames();
          "
          >Add Games</v-btn
        >
        <v-btn text @click="newGamesDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as GameSelector from "../GameSelector";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { path } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";

// Enum for the different settings pages
enum Settings {
  GENERAL = "General",
  DATA = "Data",
  BUG = "Bug Report",
  ABOUT = "About",
}
// List of all settings options
const settings = Object.values(Settings);
// Currently selected settings page
const selectedSetting = ref(Settings.GENERAL);
// List of all games
const gameList = ref<GameSelector.GameList>([]);
// Currently selected game for deletion
const selectedGame = ref("");
// Name input for adding a new game
const addedGameName = ref("");
// Dialog state for adding new games
const newGamesDialog = ref(false);
// List of new games to be added
const newGames = ref<GameSelector.GameList>([]);

/**
 * Loads the list of games when the component is mounted.
 */
onMounted(async () => {
  gameList.value = await GameSelector.loadGameEntries();
});

/**
 * Opens the file selector dialog to add new games.
 * @param name - The name for the new game (not used directly here)
 */
const openGameSelector = async (name: string) => {
  const files = await open({
    multiple: true,
    directory: false,
  });

  if (files) {
    newGamesDialog.value = true;
    newGames.value = files.map((path) => {
      return {
        path,
        name: "",
        playTime: new GameSelector.Time(0),
        isMultiplayer: false,
      };
    });
  }
};

const openGitHubIssuePage = () => {
  const url = "https://github.com/SilasMeyer4/pseudopol/issues";
  window.open(url, "_blank");
};

const openAppData = async () => {
  const dir = await appDataDir();
  openPath(dir);
};

/**
 * Adds the selected new games to the game list and saves them.
 * Also retrieves icons for each game using the backend.
 */
const addGames = async () => {
  let iconPath = await appDataDir();
  const formattedGames: GameSelector.GameList = await Promise.all(
    newGames.value.map(async (game) => {
      await invoke("get_icon_from_file_path", {
        path: game.path,
        folderPath: iconPath,
        name: game.name,
      });

      return {
        name: game.name,
        path: game.path,
        playTime: new GameSelector.Time(0),
        isMultiplayer: game.isMultiplayer,
        iconPath: iconPath, //TODO: set correct icon path if needed
      };
    })
  );

  gameList.value = [...gameList.value, ...formattedGames];
  GameSelector.saveGamesList(gameList.value);
  newGamesDialog.value = false;
};

/**
 * Removes a game from the game list by name and saves the updated list.
 * @param name - The name of the game to remove
 */
const removeGame = async (name: string) => {
  console.log(name);
  gameList.value = gameList.value.filter((entry) => entry.name !== name);
  GameSelector.saveGamesList(gameList.value);
};
</script>

<style scoped>
.settings-sidebar {
  background-color: #252525;
  padding-top: 20px;
  padding-right: 20px;
  height: 100%;
  border-right: 2px solid black; /* Thin black separator */
}

.settings-menu {
  background-color: #3b3b3b;
  height: 500px;
}

.settings-list {
  background-color: #303030;
  height: 500px;
}

.dark-checkbox {
  color: #252525 !important;
}

.game-container {
  border: #252525 solid;
}
</style>
