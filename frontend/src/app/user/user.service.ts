import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { User } from "../shared/models/user.model";
import { AuthService } from "../auth/auth.service";
import { UserUpdateDTO } from "../shared/models/userUpdateDTO.model";
import { PageProperties } from "../shared/models/page.modal";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly BASE_URL = "http://localhost:8081";
  private readonly API_ENDPOINTS = {
    USER: `${this.BASE_URL}/user`,
  };

  users: User[] = [];
  properties: Subject<PageProperties> = new Subject<PageProperties>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_ENDPOINTS.USER}/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUser(userId: string, user: Partial<UserUpdateDTO>): Observable<User> {
    return this.http.patch<User>(`${this.API_ENDPOINTS.USER}/${userId}`, user, {
      headers: this.getAuthHeaders(),
    });
  }

  fetchUsers(
    status: boolean,
    page: number,
    role: string
  ): Observable<{ content: User[]; properties: PageProperties }> {
    let url = `${this.API_ENDPOINTS.USER}?page=${page}`;

    if (role !== undefined) {
      url += `&role=${role}`;
    }

    if (status !== null) {
      url += `&status=${status}`;
    }

    return this.http.get<{ content: User[]; properties: PageProperties }>(url, {
      headers: this.getAuthHeaders(),
    });
  }

  toggleUserStatus(userId: string): Observable<User> {
    return this.http.patch<User>(
      `${this.API_ENDPOINTS.USER}/status/${userId}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
