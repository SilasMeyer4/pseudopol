<template>
  <v-container class="console-container">
    <v-row
      v-for="(log, index) in logs"
      :key="index"
      :class="`log-entry ${log.type}`"
    >
      <div>
        <span class="timestamp">[{{ log.timestamp }}]</span>
        <span class="type">{{ log.type }}</span
        >:
        <span class="message">{{ format(log.message) }}</span>
      </div>
      <pre v-if="log.stack" class="stack">{{ log.stack }}</pre>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import Logger from "./logger";
import { LogEntry } from "./logger";
import "../../style.css";

const logs = ref<LogEntry[]>([]);

const format = (message: any[]) => {
  return message
    .map((m) => (typeof m === "object" ? JSON.stringify(m) : String(m)))
    .join(" ");
};

onMounted(async () => {
  await listen<LogEntry>("log-message", (event) => {
    logs.value.push(event.payload);
  });
});
</script>

<style scoped>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

.console-container {
  background: #1e1e1e;
  color: white;
  font-family: monospace;
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
}
.log-entry.log {
  color: white;
}
.log-entry.warn {
  color: orange;
}
.log-entry.error {
  color: red;
}
.log-entry.info {
  color: lightblue;
}
.timestamp {
  color: gray;
  margin-right: 0.5rem;
}
.type {
  font-weight: bold;
}
.message {
  margin-left: 0.5rem;
  white-space: pre-wrap;
}
.stack {
  color: gray;
  font-size: 0.8rem;
  margin-top: 4px;
  white-space: pre-wrap;
}
</style>
