/**
 * Enum representing the different menu screens in the application.
 */
export enum Menu {
  MAIN, // Main menu
  LOBBY, // Lobby menu
  SETTINGS, // Settings menu
}

/**
 * Interface for player information used in menus.
 * @property maxPlayers - Maximum number of players allowed
 * @property isSinglePlayer - Whether the game is single player
 * @property isHost - Whether the player is the host
 */
export interface PlayerInfo {
  maxPlayers: number;
  isSinglePlayer: boolean;
  isHost: boolean;
}
