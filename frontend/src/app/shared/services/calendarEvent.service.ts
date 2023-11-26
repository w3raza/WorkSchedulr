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
    let url = `${this.API_ENDPOINTS.CALENDAR}`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get<CalendarEvent[]>(url);
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(
      `${this.API_ENDPOINTS.CALENDAR}`,
      event
    );
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.patch<CalendarEvent>(
      `${this.API_ENDPOINTS.CALENDAR}`,
      event
    );
  }

  deleteEvent(id: string): Observable<string> {
    return this.http.delete<string>(`${this.API_ENDPOINTS.CALENDAR}?id=${id}`, {
      responseType: "text" as "json",
    });
  }
}
