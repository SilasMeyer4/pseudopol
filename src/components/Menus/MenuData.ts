export enum Menu {
    MAIN,
    LOBBY,
    SETTINGS
}

export interface PlayerInfo {
    maxPlayers: number;
    isSinglePlayer: boolean,
    isHost: boolean
}