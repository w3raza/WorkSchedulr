import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CalendarEvent } from "../models/calendar-event.model";

@Injectable({
  providedIn: "root",
})
export class CalendarEventService {
  private readonly url = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    CALENDAR: `${this.url}/calendarEvent`,
  };

  constructor(private http: HttpClient) {}

  getEvents(userId: string | null): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(
      `${this.API_ENDPOINTS.CALENDAR}?userId=${userId}`
    );
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    console.log(event);
    return this.http.post<CalendarEvent>(
      `${this.API_ENDPOINTS.CALENDAR}`,
      event
    );
  }
}
