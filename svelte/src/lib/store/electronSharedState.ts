import produce, { applyPatches, type Patch, enablePatches } from 'immer';
import type  { IpcRenderer, IpcMainInvokeEvent, IpcRendererEvent }  from 'electron';
import type { Objectish } from 'immer/dist/internal';


declare global {
  interface Window { ipcRenderer: Electron.IpcRenderer; }
}

const ipcRenderer = window.ipcRenderer;


enablePatches();

interface IChangePack {
  patches: Patch[];
  description?: string;
  senderId?: number;
}

export function createSharedStore<T extends Objectish>(state: T) {
  let innerState = state;
  let lastChange: IChangePack = { patches: [] };
  const listeners: ((state: T, description?: string) => void)[] = [];

  const ipcModule = ipcRenderer;
  const INTERNAL_CHANNEL = '@@ELECTRON_SHARED_STORE_IPC_CHANNEL';
  const INTERNAL_CHANNEL_INIT = '@@ELECTRON_SHARED_STORE_IPC_CHANNEL_INIT';

  let isUpdating = false;

  ipcModule.on(
    INTERNAL_CHANNEL,
    (event: IpcMainInvokeEvent | IpcRendererEvent, change: IChangePack) => {
      if (change.patches.length === 0) {
        return;
      }

      isUpdating = true;

      const nextState = applyPatches(innerState, change.patches);
      lastChange = {
        ...change,
        senderId: -1,
      };

      broadcastChange();

      innerState = nextState;

      isUpdating = false;

      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener(innerState, change.description);
      }
    }
  );


  function reset(){
    (ipcModule as IpcRenderer).send(INTERNAL_CHANNEL_INIT);

  }

  function broadcastChange() {
    if (lastChange.patches.length === 0) {
      return;
    }

    lastChange.senderId !== -1 &&
      (ipcModule as IpcRenderer).send(INTERNAL_CHANNEL, lastChange);
    
  }

  function setState(recipe: (draft: T) => void, description?: string) {
    isUpdating = true;

    const nextState = produce(innerState, recipe, (patches) => {
      lastChange = { patches, description };
    });

    broadcastChange();

    innerState = nextState;
    isUpdating = false;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(innerState, lastChange.description);
    }

    return nextState;
  }

  function getState(): T {
    if (isUpdating) {
      throw new Error(
        'You may not call store.getState() inside setState method. ' +
          'It has already received the state as an argument. '
      );
    }

    return innerState;
  }

  function subscribe(listener: (state: T, description?: string) => void) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isUpdating) {
      throw new Error(
        'You may not call store.subscribe() inside store.setState(). '
      );
    }

    listeners.push(listener);

    // run once for the first time for every one who just subscribed
    listener(innerState, lastChange.description);

    return function unsubscribe() {
      if (isUpdating) {
        throw new Error(
          'You may not unsubscribe from a store listener while the state is updating. '
        );
      }

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  (ipcModule as IpcRenderer).on(INTERNAL_CHANNEL_INIT, (event: IpcRendererEvent, state: T) => {
    console.log('got state', state);
    setState(() => {
      return state
    })
  });
  (ipcModule as IpcRenderer).send(INTERNAL_CHANNEL_INIT);


  return { setState, getState, subscribe, reset };
}