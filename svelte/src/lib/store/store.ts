import { createSharedStore } from './electronSharedState';
import { writable} from 'svelte/store';


const initialValue = {
  initializated: false,
  calendarSettings: {
    isLightMode: false,
    showWindow: false,
    alwaysVisible: false,
  },
}

type SharedState = typeof initialValue;

const externalStore = createSharedStore(initialValue);
externalStore.getState();
externalStore.setState((state) => {
  console.log("Shared store updated", state)
  return state})
function buildSharedStore(){
  const { subscribe, set } = writable(initialValue);

  externalStore.subscribe((state) => {
    console.log("Shared store updated", state);
    set(state);
  });

  return {
    subscribe,
    update:  externalStore.setState
  };
}


const sharedStore = buildSharedStore();
export default sharedStore;