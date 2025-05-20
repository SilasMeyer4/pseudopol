<template>
  <main class="container">
    <h1 class="title">Pseudopol</h1>

    <MainMenu></MainMenu>




    <!--Update DIALOG-->
    <v-dialog v-model="updateDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Update</v-card-title>
        <v-card-text>
           Do you want to update the application (recommended)?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="updateDialog = false">Abbrechen</v-btn>
          <v-btn text @click="updateDialog = false ;runUpdater()">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </main>
</template>


<script setup lang="ts">

import './style.css';
import { onMounted, ref } from "vue";
import MainMenu from "./components/Menus/MainMenu.vue";
import {create_games_directory} from "./components/Menus/GameSelector";
import { check_for_update, runUpdater } from './utils/updater';

const updateDialog = ref(false);

onMounted(async() => {
  create_games_directory();
  if (await check_for_update()) {
    updateDialog.value = true;
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