import { appDataDir} from "@tauri-apps/api/path";
import {writeTextFile, readTextFile, BaseDirectory, exists, mkdir, remove} from "@tauri-apps/plugin-fs"
import { openPath } from "@tauri-apps/plugin-opener";

export type GameList = GameEntry[]

export class Time {

  constructor(hours: number, minutes: number, seconds: number);
  constructor(totalSeconds: number);

  constructor(a: number, b?: number, c?: number) {
    if (b !== undefined && c !== undefined) {
      // Called with (hours, minutes, seconds)
      this.hours = a;
      this.minutes = b;
      this.seconds = c;
    } else {
      // Called with (totalSeconds)
      const totalSeconds = a;
      this.seconds = totalSeconds % 60;
      this.minutes = (totalSeconds / 60) % 60;
      this.hours = (totalSeconds / 3600) 
    }
  }

  public addSec(seconds: number) {
      this.seconds += (seconds % 60);
      this.minutes += (seconds / 60) % 60;
      this.hours += (seconds / 3600) 
  }

  hours: number = 0
  minutes: number = 0
  seconds: number = 0
}

export interface GameEntry {
    name: string,
    path: string,
    playTime: Time
    
}

/**
 * @param game_list Liste von Game Entries
 * Makes some nice things
 */
export async function save_games_list(game_list: GameList) {
    let json_data = JSON.stringify(game_list, null, 2);
    console.log(json_data);
    await writeTextFile(`games/entries.json`, json_data, {baseDir: BaseDirectory.AppData});
}

/**
 * @returns Game List
 * Makes some nice things2
 */
export async function load_game_entries(): Promise<GameList> {
    let json_data = await readTextFile("games\\entries.json", {baseDir: BaseDirectory.AppData});
      const rawList: GameEntry[] = JSON.parse(json_data);

    // Convert plain objects to proper Time instances
    return rawList.map((game) => ({
      ...game,
      playTime: new Time(game.playTime.hours, game.playTime.minutes, game.playTime.seconds),
    }));   
}

export async function open_appdata_in_file_system() {
    openPath(await appDataDir());
}


export async function create_games_directory() {
    try {
        const doesDataDirExist = await exists(`games`, {baseDir: BaseDirectory.AppData});

        if (!doesDataDirExist) {
            await mkdir(`games`, {baseDir: BaseDirectory.AppData, recursive: true});
            console.log("Created Data Folder");
        }
      } catch (err) {
        console.error("Error in create_character_directory:", err);
      }
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}

export async function remove_game(name: string) {
  const sanitizedName = sanitizeFileName(name);
  await remove(`data/characters/${sanitizedName}.json`, {baseDir: BaseDirectory.AppData});
}