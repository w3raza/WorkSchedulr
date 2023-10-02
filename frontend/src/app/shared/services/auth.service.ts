import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { LoginResponse } from "../models/loginResponse.model";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "http://localhost:8081";

  API_ENDPOINTS = {
    SIGNIN: `${this.url}/users/signin`,
  };

  private user = new BehaviorSubject<User | null>(null);

  userLogin$ = this.user.asObservable();

  subscription: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }

  private handleAuthentication(
    username: string,
    token: string,
    role: string
  ): void {
    const user = new User(username, token, role);
    this.user.next(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  loginUser<T>(username: T, password: T): Observable<LoginResponse> {
    const payload: any = {
      username: username,
      password: password,
    };

    return this.http
      .post<LoginResponse>(this.API_ENDPOINTS.SIGNIN, payload)
      .pipe(
        catchError((error) => {
          switch (error.status) {
            case 401:
              throw new Error(error.error.message);
            case 503:
              throw new Error("Service Unavailable");
            default:
              throw new Error("An unknown error occurred");
          }
        }),
        tap((response) => {
          this.setAuthToken(response.token);
          this.handleAuthentication(
            response.username,
            response.token,
            response.userRoles[0]
          );
        })
      );
  }

  registerUser<T>(
    username: T,
    password: T,
    email: T,
    firstName: T,
    lastName: T,
    phone: T,
    birth: T
  ): Observable<LoginResponse> {
    const payload: any = {
      username: username,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      birth: birth,
    };

    return this.http
      .post<LoginResponse>(`${this.url}/users/signup`, payload)
      .pipe(
        catchError((error) => {
          switch (error.status) {
            case 401:
              throw new Error(error.error.message);
            case 503:
              throw new Error("Service Unavailable");
            default:
              throw new Error("An unknown error occurred");
          }
        }),
        tap((response) => {
          this.setAuthToken(response.token);
          this.handleAuthentication(
            response.username,
            response.token,
            response.userRoles[0]
          );
        })
      );
  }

  logoutUser(): Observable<any> {
    return this.http.get(`${this.url}/users/signout`, {}).pipe(
      tap(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        this.user.next(null);
      })
    );
  }
}
