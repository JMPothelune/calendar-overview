import { createSharedStore } from './electronSharedState';
import { writable} from 'svelte/store';

export type CalendarEvent = {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  location: string;
  url: string;
}

const initialValue = {
  initializated: false,
  calendarSettings: {
    isLightMode: false,
    showWindow: false,
    alwaysVisible: false,
  },
  calendarEvents: [] as CalendarEvent[],
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