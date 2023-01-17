import { createSharedStore } from './electronSharedState';

const calendarSettings = {
  isLightMode: false,
  showWindow: false,
  alwaysVisible: false,
};


const initialValue = {
  initializated: true,
  calendarSettings,
}

const sharedStore = createSharedStore(initialValue);
  
export default sharedStore;