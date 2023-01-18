import type { IpcRendererEvent } from "electron";
import { writable } from "svelte/store";

declare global {
  interface Window { ipcRenderer: Electron.IpcRenderer; }
}

export function createSharedStore<T>( storeName: string, initialState:T ) {
  const { subscribe, set } = writable(initialState);
  let internalState = initialState;

  const ipcModule = window.ipcRenderer;

  const CHANNEL_UPDATE = `@@SVELTE_SHARED_STORE_IPC_CHANNEL_UPDATE_${storeName}`;
  const CHANNEL_REQUIRE_SYNC = `@@SVELTE_SHARED_STORE_IPC_CHANNEL_REQUIRE_SYNC_${storeName}`;

  ipcModule.on(CHANNEL_UPDATE, (event: IpcRendererEvent, change: T) => {
    set(change);
  });

  function requireSync(){
    ipcModule.send(CHANNEL_REQUIRE_SYNC);
  }

  function sendUpdate(change: T) {
    ipcModule.send(CHANNEL_UPDATE, change);
  }

  ipcModule.send(CHANNEL_REQUIRE_SYNC);

  return {
    subscribe,
    set: (value: T) => {
      internalState = value;
      sendUpdate(value);
    },
    update: (updater: (previousState: T) => T) => {
      const newState = updater(internalState);
      internalState = newState;
      sendUpdate(newState);
    },

    requireSync
  };
}