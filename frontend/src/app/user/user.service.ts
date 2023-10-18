import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../shared/models/user.model";
import { Observable, Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { UserUpdateDTO } from "../shared/models/userUpdateDTO.model";
import { PageProperties } from "../shared/models/page.modal";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private url = "http://localhost:8081";

  API_ENDPOINTS = {
    USER: `${this.url}/user`,
  };

  users: User[] = [];

  properties: Subject<PageProperties> = new Subject<PageProperties>();

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

  updateUser(userId: string, user: Partial<UserUpdateDTO>): Observable<User> {
    const token = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<User>(`${this.API_ENDPOINTS.USER}/${userId}`, user, {
      headers: headers,
    });
  }

  fetchUsers(
    status: boolean,
    page: number,
    selectedRole: string
  ): Observable<{ users: User[]; properties: PageProperties }> {
    const token = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let url = `${this.API_ENDPOINTS.USER}?page=${page}`;
    if (selectedRole !== "all") {
      url += `&userRole=${selectedRole}`;
    }

    return this.http.get<{ users: User[]; properties: PageProperties }>(
      url,
      {
        headers: headers,
      }
    );
  }

  toggleUserStatus(userId: string): Observable<User> {
    const token = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<User>(
      `${this.API_ENDPOINTS.USER}/status/${userId}`,
      {
        headers: headers,
      }
    );
  }
}
