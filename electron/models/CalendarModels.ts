import * as ical from 'node-ical';

export type CalendarEvent = ical.VEvent & {
  calendar: CalendarSource;
}

export interface CalendarSource {
  name: string;
  icalUrl: string;
  color: string;
}
