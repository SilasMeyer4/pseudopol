import { appDataDir } from "@tauri-apps/api/path";
import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  exists,
  mkdir,
  remove,
} from "@tauri-apps/plugin-fs";
import { openPath } from "@tauri-apps/plugin-opener";

/**
 * Adds test data for games and opens app data folder.
 * Used for development/testing.
 */
export function addTestGames(loadGames: () => void) {
  let list: GameList = [];
  for (let index = 0; index < 10; index++) {
    const newGame: GameEntry = {
      name: `Test${index}`,
      path: "wewewe",
      playTime: new Time(0),
      isMultiplayer: false,
    };
    list.push(newGame);
  }
  loadGames();
  saveGamesList(list);
  openAppdataInFileSystem();
}

/**
 * Selects a game from the list.
 * @param game - The game entry to select
 * @param selectedGameRef - The ref to update
 */
export function selectGame(
  game: GameEntry,
  selectedGameRef: { value: GameEntry }
) {
  selectedGameRef.value = game;
}

/**
 * Launches the selected game and updates play time.
 * @param game - The game entry to launch
 * @param gamesRef - The ref to the games list
 */
import { invoke } from "@tauri-apps/api/core";
export function launchGame(
  game: GameEntry,
  gamesRef: { value: GameList | undefined }
) {
  invoke("launch_game", { path: game.path }).then((timePlayed) => {
    console.log("typescript", timePlayed);
    game.playTime.addSec(timePlayed as number);
    if (gamesRef.value) {
      saveGamesList(gamesRef.value);
    }
  });
}

export type GameList = GameEntry[];

/**
 * Class representing a time duration (hours, minutes, seconds).
 * Can be constructed with either (hours, minutes, seconds) or (totalSeconds).
 */
export class Time {
  /**
   * Creates a new Time instance.
   * @param hours - Hours or total seconds if minutes/seconds are omitted
   * @param minutes - Minutes (optional)
   * @param seconds - Seconds (optional)
   */
  constructor(hours: number, minutes: number, seconds: number);
  constructor(totalSeconds: number);

  constructor(hours: number, minutes?: number, seconds?: number) {
    if (minutes !== undefined && seconds !== undefined) {
      // Called with (hours, minutes, seconds)
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
    } else {
      // Called with (totalSeconds)
      const totalSeconds = hours;
      this.seconds = totalSeconds % 60;
      this.minutes = Math.floor((totalSeconds / 60) % 60);
      this.hours = Math.floor(totalSeconds / 3600);
    }
  }

  /**
   * Adds seconds to the current time.
   * @param seconds - Number of seconds to add
   */
  public addSec(seconds: number) {
    const totalSeconds =
      this.hours * 3600 + this.minutes * 60 + this.seconds + seconds;
    this.seconds = totalSeconds % 60;
    this.minutes = Math.floor((totalSeconds / 60) % 60);
    this.hours = Math.floor(totalSeconds / 3600);
  }

  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
}

/**
 * Interface for a game entry in the game list.
 * @property name - Name of the game
 * @property path - File path to the game
 * @property playTime - Time played (Time instance)
 * @property isMultiplayer - Whether the game is multiplayer
 */
export interface GameEntry {
  name: string;
  path: string;
  playTime: Time;
  isMultiplayer: false;
}

/**
 * Saves the game list to a JSON file in the app data directory.
 * @param game_list - List of game entries to save
 */
export async function saveGamesList(game_list: GameList) {
  let jsonData = JSON.stringify(game_list, null, 2);
  console.log(jsonData);
  await writeTextFile(`games/entries.json`, jsonData, {
    baseDir: BaseDirectory.AppData,
  });
}

/**
 * Loads the game list from the JSON file in the app data directory.
 * Converts plain objects to proper Time instances.
 * @returns Promise resolving to the loaded game list
 */
export async function loadGameEntries(): Promise<GameList> {
  let jsonData = await readTextFile("games\\entries.json", {
    baseDir: BaseDirectory.AppData,
  });
  const rawList: GameEntry[] = JSON.parse(jsonData);

  // Convert plain objects to proper Time instances
  return rawList.map((game) => ({
    ...game,
    playTime: new Time(
      game.playTime.hours,
      game.playTime.minutes,
      game.playTime.seconds
    ),
  }));
}

/**
 * Opens the app data directory in the file system.
 */
export async function openAppdataInFileSystem() {
  openPath(await appDataDir());
}

/**
 * Creates the games directory in the app data folder if it does not exist.
 */
export async function createGamesDirectory() {
  try {
    const doesDataDirExist = await exists(`games`, {
      baseDir: BaseDirectory.AppData,
    });

    if (!doesDataDirExist) {
      await mkdir(`games`, { baseDir: BaseDirectory.AppData, recursive: true });
      console.log("Created Data Folder");
    }
  } catch (err) {
    console.error("Error in create_character_directory:", err);
  }
}

/**
 * Sanitizes a file name by replacing invalid characters with underscores.
 * @param name - The file name to sanitize
 * @returns The sanitized file name
 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}

/**
 * Removes a game file by name from the data/characters directory.
 * @param name - The name of the game to remove
 */
export async function removeGame(name: string) {
  const sanitizedName = sanitizeFileName(name);
  await remove(`data/characters/${sanitizedName}.json`, {
    baseDir: BaseDirectory.AppData,
  });
}
