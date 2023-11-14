import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CalendarEventService {
  private readonly url = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    CALENDAR: `${this.url}/calendarEvent`,
  };

  constructor(private http: HttpClient) {}

  getEvents(userId: string): Observable<any> {
    return this.http.get(`${this.API_ENDPOINTS.CALENDAR}?userId=${userId}`);
  }

  createEvent(event: any): Observable<any> {
    console.log(event);
    return this.http.post(`${this.API_ENDPOINTS.CALENDAR}`, event);
  }
}
