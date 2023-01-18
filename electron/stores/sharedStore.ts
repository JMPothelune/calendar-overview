import { createSharedStore } from '../lib/sharedStoreMain';
import { CalendarEvent } from '../models/calendarEvent';


const calendarSettingsStore = createSharedStore("calendarSettings", {
  isLightMode: false,
  showWindow: true,
  alwaysVisible: false,
})

const calendarEventsStore = createSharedStore("calendarEvents", {
  lastUpdated: new Date(),
  status: "idle" as "idle" | "updating" | "error",
  events : [] as CalendarEvent[]
});
  
export {
  calendarSettingsStore,
  calendarEventsStore,
};