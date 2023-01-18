import { ipcMain } from "electron";
import { CalendarEvent, CalendarSource } from "../models/CalendarModels";
import { calendarEventsStore, calendarSettingsStore } from "../stores/sharedStore";
import * as ical from 'node-ical';



class CalendarManager{

  constructor(){
  }

  start(){
    setInterval(async () => {
      this.updateTodaysEvents();
    }, 1000 * 60 );

    this.updateTodaysEvents();

    ipcMain.on("refresh-calendar", async (event, arg) => {
      this.updateTodaysEvents();
    });
  }
    
  async updateTodaysEvents(){
    calendarEventsStore.merge({ status: "updating"})
  
    try{
      let events = await this.getAllCalendarEvents();
      let todayEvents = this.filterTodayEvents(events);
      todayEvents = this.sortEvents(todayEvents);

      calendarEventsStore.set({
        events: todayEvents,
        lastUpdated: new Date(),
        status: "idle",
      })
    }
    catch(e){
      calendarEventsStore.merge({ status: "error" })
      console.error("CalendarManager:", e)
    } 
  }

  async getAllCalendarEvents(): Promise<CalendarEvent[]>{
    let calendarEvents: CalendarEvent[] = [];
    for(let calendar of calendarSettingsStore.getState().sources){
      let events = await this.loadCalendar(calendar);
      calendarEvents = [...calendarEvents, ...events]
    }
    return calendarEvents;
  }


  async loadCalendar(source: CalendarSource): Promise<CalendarEvent[]> {
    if(!source.icalUrl) return [];
    return new Promise((resolve, reject) => {
      ical.fromURL(source.icalUrl, {}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let events: CalendarEvent[] = [];
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              let event = data[key];
              if(event.type === 'VEVENT'){
                events.push({
                  ...event,
                  calendar: source,
                } as CalendarEvent);
              }
            }
          }
          resolve(events);
        }
      });
    });
  }
  
  filterTodayEvents(events: CalendarEvent[]): CalendarEvent[] {
    let today = new Date();
    let todayEvents: CalendarEvent[] = [];
    todayEvents = events.filter((event) => {
      if (event.start) {
      // check if the start date is today
      return event.start.getDate() === today.getDate()
          && event.start.getMonth() === today.getMonth()
          && event.start.getFullYear() === today.getFullYear();
  }
    });
    return todayEvents;
  }
  
  
  sortEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.sort(function(a, b) {
      return a.start.getTime() - b.start.getTime();
    });
  }

}


export default CalendarManager;