import type { CalendarEvent } from "$lib/models/calendarEvent";
import { createSharedStore } from "./sharedStoresRenderer";

const calendarSettings = {
  isLightMode: false,
  showWindow: false,
  alwaysVisible: false,
};

const calendarSettingsStore = createSharedStore("calendarSettings", calendarSettings);
const calendarEventsStore = createSharedStore("calendarEvents", [] as CalendarEvent[]);
  
export {
  calendarSettingsStore,
  calendarEventsStore,
};