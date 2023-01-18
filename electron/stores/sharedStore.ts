import { createSharedStore } from '../lib/sharedStoreMain';
import { CalendarEvent, CalendarSource } from '../models/CalendarModels';

const calendarSettingsStore = createSharedStore("calendarSettings", {
  isLightMode: false,
  alwaysVisible: false,
  sources: [] as CalendarSource[],
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