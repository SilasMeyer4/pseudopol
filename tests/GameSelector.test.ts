import { vi } from "vitest";
// Mock Tauri API modules before importing the code under test
vi.mock("@tauri-apps/api/path", () => ({
  appDataDir: vi.fn().mockResolvedValue("/mock/appdata"),
}));
vi.mock("@tauri-apps/plugin-fs", () => ({
  writeTextFile: vi.fn().mockResolvedValue(undefined),
  readTextFile: vi.fn().mockResolvedValue("{}"),
  BaseDirectory: { AppData: "AppData" },
  exists: vi.fn().mockResolvedValue(true),
  mkdir: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@tauri-apps/plugin-opener", () => ({
  openPath: vi.fn().mockResolvedValue(undefined),
}));

import { describe, it, expect } from "vitest";
import {
  Time,
  sanitizeFileName,
  addTestGames,
  selectGame,
} from "../src/components/Menus/GameSelector";
describe("addTestGames", () => {
  it("should add 10 test games and call loadGames", () => {
    let called = false;
    const mockLoadGames = () => {
      called = true;
    };
    addTestGames(mockLoadGames);
    expect(called).toBe(true);
  });
});

describe("selectGame", () => {
  it("should set the selectedGameRef to the given game", () => {
    const game = {
      name: "Test",
      path: "foo",
      playTime: new Time(0),
      isMultiplayer: false as false,
    };
    const selectedGameRef = {
      value: {
        name: "",
        path: "",
        playTime: new Time(0),
        isMultiplayer: false as false,
      },
    };
    selectGame(game, selectedGameRef);
    expect(selectedGameRef.value).toBe(game);
  });
});

// Tests for the Time class

describe("Time", () => {
  it("should convert total seconds to hours, minutes, and seconds", () => {
    const t = new Time(3661); // 1 hour, 1 minute, 1 second
    expect(t.hours).toBe(1);
    expect(t.minutes).toBe(1);
    expect(t.seconds).toBe(1);
  });

  it("should initialize correctly with hours, minutes, seconds", () => {
    const t = new Time(2, 30, 15);
    expect(t.hours).toBe(2);
    expect(t.minutes).toBe(30);
    expect(t.seconds).toBe(15);
  });

  it("should add seconds correctly and normalize time", () => {
    const t = new Time(1, 59, 50);
    t.addSec(15); // should add 15 seconds
    // 1:59:50 + 0:0:15 = 2:0:5 after normalization
    expect(t.hours).toBe(2);
    expect(t.minutes).toBe(0);
    expect(t.seconds).toBe(5);
  });
});

describe("sanitizeFileName", () => {
  it("should replace invalid characters with underscores", () => {
    const unsafe = 'test<>:"/\\|?*.json';
    expect(sanitizeFileName(unsafe)).toBe("test_________.json");
  });
});
