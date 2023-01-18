import type { CalendarEvent } from "$lib/models/calendarEvent";
import { createSharedStore } from "./sharedStoresRenderer";

interface CalendarSource {
  name: string;
  icalUrl: string;
  color: string;
}

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