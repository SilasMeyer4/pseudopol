<template>
  <main class="container">
    <!-- Main title, clicking logs info for debugging -->
    <h1 class="title" @click="Logger.info(4, 1)">Pseudopol</h1>

    <!-- Main menu component -->
    <MainMenu></MainMenu>

    <!-- Update dialog for application updates -->
    <v-dialog v-model="updateDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Update</v-card-title>
        <v-card-text v-if="dowloadProgress === 0">
          Do you want to update the application? Certain online features may not
          work if you are not on the latest version.
        </v-card-text>
        <v-progress-linear
          v-if="dowloadProgress > 0"
          :model-value="dowloadProgress"
          color="blue"
          height="8"
          rounded
          striped
        ></v-progress-linear>
        <v-card-text v-if="dowloadProgress > 0">
          Downloaded {{ dowloadProgress }} %
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="updateDialog = false">No</v-btn>
          <v-btn
            text
            @click="
              runUpdater((percent: number) => {
                dowloadProgress = percent;
              })
            "
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Logger component for displaying logs -->
  </main>
</template>

<script setup lang="ts">
import "./style.css";
import { onMounted, ref, watch } from "vue";
import MainMenu from "./components/Menus/MainMenu.vue";
import { createGamesDirectory as createGamesDirectory } from "./components/Menus/GameSelector";
import {
  check_for_update as checkForUpdate,
  runUpdater,
} from "./utils/updater";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import LoggerVue from "./components/Logger/Logger.vue";
import Logger from "./components/Logger/logger";

// Dialog state for update prompt
const updateDialog = ref(false);
// Download progress for update
const dowloadProgress = ref(0);
// State to track if logger window is open
let isLoggerOpen: boolean = false;

/**
 * Lifecycle hook: runs on component mount.
 * - Creates the games directory
 * - Checks for updates and opens dialog if needed
 */
onMounted(async () => {
  createGamesDirectory();
  if (await checkForUpdate()) {
    updateDialog.value = true;
  }
});

/**
 * Watches the download progress and closes the dialog when complete.
 */
watch(dowloadProgress, (newVal, oldVal) => {
  if (dowloadProgress.value >= 100) {
    updateDialog.value = false;
    dowloadProgress.value = 0;
  }
});

/**
 * Opens the logger window, or focuses it if already open.
 */
async function openLoggerWindow() {
  const existing = await WebviewWindow.getByLabel("logger");
  if (existing) {
    existing.setFocus();
    return;
  }

  new WebviewWindow("logger", {
    url: "/logger.html",
    title: "Logger",
    width: 800,
    height: 600,
    resizable: true,
  });
}

// Listen for Alt+F12 to open the logger window
window.addEventListener("keydown", (event) => {
  const isAltF12 = event.altKey && event.key === "F12";
  if (isAltF12) {
    event.preventDefault();
    openLoggerWindow();
  }
});
</script>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}
</style>
