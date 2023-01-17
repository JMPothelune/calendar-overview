// use node-ical to parse ics file 

import * as ical from 'node-ical';
import { CalendarEvent } from '../models/calendarEvent';


export function loadCalendar(calendarUrl: string): Promise<CalendarEvent[]> {
  console.log("Loading calendar from url: ", calendarUrl)
  return new Promise((resolve, reject) => {
    ical.fromURL(calendarUrl, {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        let events: CalendarEvent[] = [];
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            let ev = data[key];
            if(ev.type === 'VEVENT'){
              events.push(ev);
            }
          }
        }
        resolve(events);
      }
    });
  });
}

export function getTodayEvents(events: CalendarEvent[]): CalendarEvent[] {
  let today = new Date();
  let todayEvents: CalendarEvent[] = [];
  todayEvents = events.filter(function(ev) {
    if (ev.start) {
    // check if the start date is today
    return ev.start.getDate() === today.getDate()
        && ev.start.getMonth() === today.getMonth()
        && ev.start.getFullYear() === today.getFullYear();
}
  });
  return todayEvents;
}