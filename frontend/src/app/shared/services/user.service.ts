import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user.model";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private url = "http://localhost:8081";

  API_ENDPOINTS = {
    USER: `${this.url}/users`,
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUser(userId: string): Observable<User> {
    const token = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User>(`${this.API_ENDPOINTS.USER}/${userId}`, {
      headers: headers,
    });
  }

  updateUser(userId: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_ENDPOINTS.USER}/${userId}`, user);
  }
}
