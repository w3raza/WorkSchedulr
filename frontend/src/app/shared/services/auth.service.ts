import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { LoginResponse } from "../models/loginResponse.model";

import { NotificationService } from "./notification.service";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly url = "http://localhost:8081";
  private readonly API_ENDPOINTS = {
    SIGNIN: `${this.url}/auth/signin`,
    SIGNUP: `${this.url}/auth/signup`,
    SIGNOUT: `${this.url}/auth/signout`,
  };

  private isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService,
    private userService: UserService
  ) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.userService.setCurrentUser(JSON.parse(storedUser));
      this.isAuthenticated = true;
    }
  }

  getAuthenticated(): boolean {
    return this.isAuthenticated;
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
    return this.http.post<LoginResponse>(endpoint, payload).pipe(
      tap((response) => {
        this.handleAuthentication(response);
        this.isAuthenticated = true;
        if (endpoint === this.API_ENDPOINTS.SIGNIN) {
          this.notification.showSuccess(`Welcome ${response.email}`);
        }
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

  private handleAuthentication(response: LoginResponse): void {
    const { id, email, token, userRoles } = response;
    const user = new LoginResponse(id, email, token, userRoles);
    this.userService.setCurrentUser(user);
    this.setAuthToken(token);
  }

  handleLogout(): void {
    this.removeUser();
    this.userService.logout();
    this.isAuthenticated = false;
    this.router.navigate(["/login"]);
  }

  private removeUser(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
  }
}
