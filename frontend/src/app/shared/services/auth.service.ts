import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { LoginResponse } from "../models/loginResponse.model";

import { NotificationService } from "./notification.service";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { environment } from "src/environments/environment";
import { skipAuth } from "../interceptors/auth.interceptor";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly url = environment.apiUrl;
  private readonly API_ENDPOINTS = {
    SIGNIN: `${this.url}/auth/signin`,
    SIGNUP: `${this.url}/auth/signup`,
    SIGNOUT: `${this.url}/auth/signout`,
  };

  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isAuthenticated: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService,
    private userService: UserService
  ) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  setAuthToken(token: string | null): void {
    token
      ? localStorage.setItem("auth_token", token)
      : localStorage.removeItem("auth_token");
  }

  loginUser(email: string, password: string): Observable<LoginResponse> {
    return this.authenticateUser(this.API_ENDPOINTS.SIGNIN, {
      email,
      password,
    });
  }

  registerUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    birth: string
  ): Observable<LoginResponse> {
    return this.authenticateUser(this.API_ENDPOINTS.SIGNUP, {
      email,
      password,
      firstName,
      lastName,
      phone,
      birth,
    });
  }

  private authenticateUser(
    endpoint: string,
    payload: any
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(endpoint, payload, { context: skipAuth() })
      .pipe(
        tap((response) => {
          this.handleAuthentication(response.token);
          this.isAuthenticatedSubject.next(true);
          this.notification.showSuccess(`Welcome ${response.email}`);
        })
      );
  }

  logoutUser(): Observable<any> {
    return this.http.get(this.API_ENDPOINTS.SIGNOUT).pipe(
      tap(() => {
        this.notification.showSuccess("Sign out successful");
        this.handleLogout();
      })
    );
  }

  private handleAuthentication(token: string): void {
    this.setAuthToken(token);
  }

  handleLogout(): void {
    localStorage.removeItem("auth_token");
    this.userService.clearCurrentUser();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(["/login"]);
  }
}
