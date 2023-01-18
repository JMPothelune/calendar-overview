import type { CalendarEvent } from "$lib/models/calendarEvent";
import { createSharedStore } from "./sharedStoresRenderer";

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