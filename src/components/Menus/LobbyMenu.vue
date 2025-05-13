<template>
  <v-container>




     <v-container class="game-selector">
      <v-row class="horizontal-scroll-row">
        <v-col
          v-for="game in games"
          :key="game.name"
          cols="auto"
          class="game-card"
        >
          <v-card
            class="elevation-4 rounded-xl pa-4 game-card-inner"
            @click="select_game(game)"
          >
            <v-card-title class="text-h6">{{ game.name }}</v-card-title>
            <v-card-subtitle class="text-caption text-grey-darken-1">{{ game.path }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
    <div>
        {{selected_game}}
    </div>

    
  <v-btn @click="add_game">Test Button</v-btn>
  <v-btn @click="back_to_main_menu"></v-btn>

  </template>
  
  
  
  <script setup lang="ts">
import { onMounted, ref } from 'vue';
  import * as GameSelector from "./GameSelector";


  const games = ref<GameSelector.GameList>();
  const selected_game = ref<GameSelector.GameEntry>();

  onMounted(async () => {
    games.value = await GameSelector.load_game_entries();
    console.log(games);
  });

  const select_game = ((game: GameSelector.GameEntry) => {
    selected_game.value = game;
  });

  const add_game = (() => {
    let list: GameSelector.GameList = [];
    for (let index = 0; index < 10; index++) {
      const newGame: GameSelector.GameEntry = {name: `Test${index}`, path: "wewewe"};
      list.push(newGame);
    }

    load_games();
    GameSelector.save_games_list(list);
    GameSelector.open_appdata_in_file_system();
  });


  const load_games = (async () => {
    games.value = await GameSelector.load_game_entries();
    console.log(games);
  });


  const back_to_main_menu = (() => {
    console.log("helo");
  });


  </script>
  
  <style scoped>
.game-selector {
  padding-bottom: 16px;
  margin-top: 20px;
  border: 2px solid #3c3b3b; /* Light border around the container */
  border-radius: 12px; /* Rounded corners for the container */
  padding: 16px;
  background-color: #4c4c4c; /* Slight background color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for a nice effect */
}

.horizontal-scroll-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 1rem 0;
  gap: 1rem;
  scroll-behavior: smooth;
}

.horizontal-scroll-row::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll-row::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 4px;
}

/* Customize card appearance */
.game-card {
  min-width: 220px;
  flex: 0 0 auto;
}

.game-card-inner {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.game-card-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
  </style>
  <style>

  </style>