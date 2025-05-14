<template>
    <v-container fluid class="settings-menu">
        <v-row no-gutters>
            <v-col cols="2" class="settings-sidebar">
                <v-list class="settings-list">
                    <v-list-item v-for="(setting, index) in settings" :key="index" @click="selectedSetting = setting">
                        <div>
                            {{ setting }}
                        </div>
                    </v-list-item>
                </v-list>
            </v-col>


            <v-col cols="10" class="settings-body">
                <div v-if="selectedSetting === Settings.GENERAL">
                    Genral setting page
                </div>

                <v-container v-if="selectedSetting === Settings.DATA" fluid>
                    <v-row class="mb-4">
                        <v-col cols="12">
                        <h3>Data Management</h3>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6">
                            <v-text-field block placeholder="Game Name (free to choose what you want)" v-model="add_game_name"></v-text-field>
                        </v-col>

                        <v-col cols="6">
                        <v-btn block @click="add_game(add_game_name)">Add Game</v-btn>
                        </v-col>

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


                        <v-col cols="6">
                        <v-btn block @click="remove_game(selectedGame)">Delete Game</v-btn>
                        </v-col>

                    

                        
                    </v-row>
                    </v-container>

                <div v-if="selectedSetting === Settings.BUG">
                    Bug Report page
                </div>

                <div v-if="selectedSetting === Settings.ABOUT">
                    Peudopol created by Dennis Probst and Silas Meyer
                </div>
            </v-col>




        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as GameSelector from "./GameSelector"
import { open } from '@tauri-apps/plugin-dialog';

enum Settings {
    GENERAL = "General",
    DATA = "Data",
    BUG = "Bug Report",
    ABOUT = "About"
}
const settings = Object.values(Settings);
const selectedSetting = ref(Settings.GENERAL);
const gameList = ref<GameSelector.GameList>([]);
const selectedGame = ref('');
const add_game_name = ref("");

onMounted(async() => {
    gameList.value = await GameSelector.load_game_entries();
});

const add_game = (async(name: string) => {
    const file = await open({
        multiple: false,
        directory: false
    });

    if (file !== null) {
        let newEntry: GameSelector.GameEntry = {name: name, path: file};
        gameList.value = [...gameList.value, newEntry];
        GameSelector.save_games_list(gameList.value);
        console.log(gameList);
    }
});

const remove_game = (async(name: string) => {
    console.log(name);
    gameList.value = gameList.value.filter(entry => entry.name !== name);
    GameSelector.save_games_list(gameList.value);
});


</script>

<style scoped>

.settings-sidebar {
  background-color: #252525;
  padding-top: 20px;
  padding-right: 20px;
  height: 100%;
   border-right: 2px solid black; /* 👈 Thin black separator */
}

.settings-menu{
    background-color: #3b3b3b;
    height: 500px;
}

.settings-list {
    background-color: #303030;
    height: 500px;
}



</style>