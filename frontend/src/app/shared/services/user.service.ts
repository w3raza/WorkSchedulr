import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";

import { User } from "../models/user.model";
import { AuthService } from "./auth.service";
import { UserUpdateDTO } from "../models/userUpdateDTO.model";
import { PageProperties } from "../models/page.modal";
import { LoginResponse } from "../models/loginResponse.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly BASE_URL = "http://localhost:8081";
  private readonly API_ENDPOINTS = {
    USER: `${this.BASE_URL}/user`,
  };

  private _currentUser = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this._currentUser.asObservable();
  users: User[] = [];
  properties: Subject<PageProperties> = new Subject<PageProperties>();

  constructor(private http: HttpClient) {}

  setCurrentUser(user: LoginResponse): void {
    //localStorage.setItem("user", JSON.stringify(user));
    this._currentUser.next(user);
  }

  logout(): void {
    this._currentUser.next(null);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_ENDPOINTS.USER}/${userId}`);
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

    return this.http.get<{ content: User[]; properties: PageProperties }>(url);
  }

  updateUser(userId: string, user: Partial<UserUpdateDTO>): Observable<User> {
    return this.http.patch<User>(`${this.API_ENDPOINTS.USER}/${userId}`, user);
  }

  createUser(user: User): Observable<User> {
    console.log("Hi: " + user);
    return this.http.post<User>(`${this.API_ENDPOINTS.USER}`, user);
  }

  toggleUserStatus(userId: string): Observable<User> {
    return this.http.patch<User>(
      `${this.API_ENDPOINTS.USER}/status/${userId}`,
      {}
    );
  }
}
