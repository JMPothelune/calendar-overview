import { getTodayEvents, loadCalendar } from "../services/calendarLoader";
import { calendarEventsStore } from "../stores/sharedStore";



class CalendarManager{

  constructor(){
  }

  start(){
    setInterval(async () => {
      this.updateTodaysEvents();
    }
    , 1000 * 60 );

    this.updateTodaysEvents();
  }
    
  async updateTodaysEvents(){
    
    const calendarUrl = "https://calendar.google.com/calendar/ical/c_976a6d6ff1a313dadeebaaac5948c04f9cbea113138c52ad2b13e72669a7cfc9%40group.calendar.google.com/private-4347244b240b6f786f2f28364b396366/basic.ics"
    try{

      let events = await loadCalendar(calendarUrl)

      let todayEvents = getTodayEvents(events);

      calendarEventsStore.set(todayEvents);
      return todayEvents;
    }
    catch(e){
      console.error("ERROR:", e)
    } 

  }
}


export default CalendarManager;