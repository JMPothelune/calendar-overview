import { CalendarEvent } from '../models/calendarEvent';
import { createSharedStore } from './electronSharedState';

const calendarSettings = {
  isLightMode: false,
  showWindow: false,
  alwaysVisible: false,
};


const initialValue = {
  initializated: true,
  calendarSettings,
  calendarEvents: [] as CalendarEvent[],
}

const sharedStore = createSharedStore(initialValue);
  
export default sharedStore;