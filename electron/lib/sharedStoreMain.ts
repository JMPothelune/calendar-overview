import { ipcMain, IpcMainEvent, IpcMainInvokeEvent, webContents } from "electron";


export function createSharedStore<T>( storeName: string, initialState:T ) {
  let internalState = initialState;

  const ipcModule = ipcMain;
  const connectedRenderers = new Set<number>();
  const listeners: ( (newState: T, previousState?: T) => void )[] = [];

  const CHANNEL_UPDATE = `@@SVELTE_SHARED_STORE_IPC_CHANNEL_UPDATE_${storeName}`;
  const CHANNEL_REQUIRE_SYNC = `@@SVELTE_SHARED_STORE_IPC_CHANNEL_REQUIRE_SYNC_${storeName}`;


  ipcMain.on(CHANNEL_REQUIRE_SYNC, (event: IpcMainInvokeEvent) => {
    console.log("REQUIRE SYNC", storeName);
    connectedRenderers.add(event.sender.id);
    event.sender.send(CHANNEL_UPDATE, internalState);
  });

  ipcMain.on(CHANNEL_UPDATE, (event: IpcMainInvokeEvent, newState: T) => {
    console.log("UPDATE", storeName,  newState);
    connectedRenderers.add(event.sender.id);
    
    if(internalState === newState) return; // TODO: compare deeply

    const previousState = internalState;
    internalState = newState

    broadcastChange();

    for (let listener of listeners) {
      listener(newState, previousState);
    }
  });

  function broadcastChange() {
    for (let id of connectedRenderers) {
      const webContent = webContents.fromId(id);
      if (webContent) {
        webContent.send(CHANNEL_UPDATE, internalState);
      }
    }
  }

  function update(updater: (previousState: T) => T) {
    const newState = updater(internalState);
    const previousState = internalState;
    
    internalState = newState;
    broadcastChange();

    for (let listener of listeners) {
      listener(newState, previousState);
    }

  }

  function set(newState: T) {
    const previousState = internalState;
    internalState = newState;
    broadcastChange();

    for (let listener of listeners) {
      listener(newState, previousState);
    }
  }

  function getState() {
    return internalState;
  }

  function subscribe(listener: (newState: T, previousState?: T) => void) {
    listeners.push(listener);
    listener(internalState);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) listeners.splice(index, 1);
    };
  }
    



  return { set, update, getState, subscribe };
}