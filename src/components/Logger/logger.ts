import { emit } from "@tauri-apps/api/event";

type LogLevel = "log" | "info" | "warn" | "error";

export interface LogEntry {
  type: LogLevel;
  message: any[];
  timestamp: string;
  stack?: string;
}

class Logger {
  static log(...args: any[]) {
    this.send("log", args);
  }

  static info(...args: any[]) {
    this.send("info", args);
  }

  static error(...args: any[]) {
    this.send("error", args);
  }

  static warn(...args: any[]) {
    this.send("warn", args);
  }

  private static send(type: LogLevel, args: any[]) {
    const timestamp = new Date().toISOString();
    const stack = new Error().stack;

    const logEntry: LogEntry = {
      type,
      message: args,
      timestamp,
      stack,
    };

    console[type](...args);

    emit("log-message", logEntry);
  }
}

export default Logger;
