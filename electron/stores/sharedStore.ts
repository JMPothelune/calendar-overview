import { createSharedStore } from '../lib/sharedStoreMain';
import { CalendarEvent } from '../models/calendarEvent';

const calendarSettings = {
  isLightMode: false,
  showWindow: true,
  alwaysVisible: false,
};

const calendarSettingsStore = createSharedStore("calendarSettings", calendarSettings);
const calendarEventsStore = createSharedStore("calendarEvents", [] as CalendarEvent[]);
  
export {
  calendarSettingsStore,
  calendarEventsStore,
};