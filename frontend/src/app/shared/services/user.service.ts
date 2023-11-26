import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, tap } from "rxjs";

import { User } from "../models/user.model";
import { UserUpdateDTO } from "../models/userUpdateDTO.model";
import { UserResponse } from "../models/userResponse.model";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    USER: `${this.BASE_URL}/user`,
  };
  private currentUser: User | null = null;
  users: User[] = [];

  constructor(private http: HttpClient) {}

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): Observable<User | null> {
    if (this.currentUser == null) {
      return this.fetchCurrentUser().pipe(
        tap((currentUser) => {
          this.setCurrentUser(currentUser);
        })
      );
    } else {
      return of(this.currentUser);
    }
  }

  getCurrentUserId(): string | null {
    if (this.currentUser == null) {
      this.getCurrentUser().subscribe((currentUser) => {
        if (currentUser) {
          this.setCurrentUser(currentUser);
        }
      });
    }
    return this.currentUser ? this.currentUser.id : null;
  }

  clearCurrentUser(): void {
    this.currentUser = null;
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_ENDPOINTS.USER}/${userId}`);
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_ENDPOINTS.USER}/me`);
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_ENDPOINTS.USER}/all`);
  }

  fetchUsers(
    status: boolean,
    page: number,
    size: number,
    role: string
  ): Observable<UserResponse> {
    let url = `${this.API_ENDPOINTS.USER}?page=${page}&size=${size}`;

    if (role !== undefined) {
      url += `&role=${role}`;
    }

    if (status !== null) {
      url += `&status=${status}`;
    }

    return this.http.get<UserResponse>(url);
  }

  updateUser(userId: string, user: Partial<UserUpdateDTO>): Observable<User> {
    return this.http.patch<User>(`${this.API_ENDPOINTS.USER}/${userId}`, user);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_ENDPOINTS.USER}`, user);
  }

  toggleUserStatus(userId: string): Observable<User> {
    return this.http.patch<User>(
      `${this.API_ENDPOINTS.USER}/status/${userId}`,
      {}
    );
  }

  deleteUser(email: string): Observable<string> {
    return this.http.delete<string>(
      `${this.API_ENDPOINTS.USER}?email=${email}`,
      {
        responseType: "text" as "json",
      }
    );
  }
}
