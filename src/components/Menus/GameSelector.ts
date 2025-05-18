import { appDataDir, executableDir } from "@tauri-apps/api/path";
import {writeTextFile, readTextFile, BaseDirectory, create, open, exists, mkdir, readDir, remove} from "@tauri-apps/plugin-fs"
import { invoke } from "@tauri-apps/api/core";
import { path } from "@tauri-apps/api";
import { openPath } from "@tauri-apps/plugin-opener";

export type GameList = GameEntry[]

export interface GameEntry {
    name: string,
    path: string
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
    return JSON.parse(json_data);    
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