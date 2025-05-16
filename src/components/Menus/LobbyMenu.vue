<template>
  <v-container>
  <v-text class="text-subtitle-2 ip-adress" v-if="playerInfo.isHost">{{ipAddr}}</v-text>
    <v-container>
      <Chat></Chat>
    </v-container>


    <div>
        Selected Game: {{selected_game.name}}
    </div>
     <v-container class="game-selector" :class="{'single-player': isSinglePlayer}">
      <v-row :class="[isSinglePlayer ? 'vertical-scroll-row' : 'horizontal-scroll-row']">
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
            <v-card-actions v-if="isSinglePlayer">
              <v-btn color="primary" @click.stop="launch_game(game.path)">Start</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  <v-btn @click="launch_game(selected_game.path)" class="start-game-btn">Start Game</v-btn>


  </v-container>


  


  </template>
  
  
  
  <script setup lang="ts">
import { onMounted, ref } from 'vue';
  import * as GameSelector from "./GameSelector";
  import { invoke } from '@tauri-apps/api/core';
import { PlayerInfo } from './MenuData';
import Chat from '../Chat.vue';
  

  const props = defineProps<{
    playerInfo: PlayerInfo;
  }>()


  const games = ref<GameSelector.GameList>();
  const selected_game = ref<GameSelector.GameEntry>({name: "", path: ""});
  const isSinglePlayer = ref(true);
  const ipAddr = ref("");

  onMounted(async () => {
    isSinglePlayer.value = props.playerInfo.isSinglePlayer;

    if (props.playerInfo.isHost) {
      ipAddr.value = await invoke("get_public_ip");
    }


    games.value = await GameSelector.load_game_entries();
    console.log(games);
  });

  const select_game = ((game: GameSelector.GameEntry) => {
    selected_game.value = game;
  });

  const launch_game = ((path: string) => {
      invoke("launch_game", {path: path});
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

/* Vertical scroll styling */
.vertical-scroll-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 80vh;
}

.single-player {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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

.start-game-btn{
  position: absolute;
  bottom: 0px;
  right: 16px;
  z-index: 1; /* Ensures it stays on top */

}

.ip-adress{
  position: relative;
  top: -3vh; /* Move up by 10 pixels */
}
  </style>
  <style>

  </style>