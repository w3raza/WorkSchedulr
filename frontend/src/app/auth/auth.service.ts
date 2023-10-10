import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";

import { LoginResponse } from "../shared/models/loginResponse.model";
import { UserRole } from "../shared/enums/user-role.enum";

import { NotificationService } from "../shared/services/notification.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "http://localhost:8081";

  API_ENDPOINTS = {
    SIGNIN: `${this.url}/users/signin`,
  };

  user = new BehaviorSubject<LoginResponse | null>(null);

  private isAuthenticated: boolean = false;

  userLogin$ = this.user.asObservable();

  subscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user.next(JSON.parse(storedUser));
      this.isAuthenticated = true;
    }
  }

  getAuthenticated(): boolean {
    return this.isAuthenticated;
  }

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

  loginUser<T>(email: T, password: T): Observable<LoginResponse> {
    const payload: any = {
      email: email,
      password: password,
    };

    return this.http
      .post<LoginResponse>(this.API_ENDPOINTS.SIGNIN, payload)
      .pipe(
        tap((response) => {
          this.setAuthToken(response.token);
          this.handleAuthentication(
            response.id,
            response.email,
            response.token,
            response.userRoles
          );
          this.isAuthenticated = true;
          this.notification.showSuccess("Welcom " + response.email);
        })
      );
  }

  registerUser<T>(
    email: T,
    password: T,
    firstName: T,
    lastName: T,
    phone: T,
    birth: T
  ): Observable<LoginResponse> {
    const payload: any = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      birth: birth,
    };

    return this.http
      .post<LoginResponse>(`${this.url}/users/signup`, payload)
      .pipe(
        tap((response) => {
          this.setAuthToken(response.token);
          this.handleAuthentication(
            response.id,
            response.email,
            response.token,
            response.userRoles
          );
          this.isAuthenticated = true;
        })
      );
  }

  logoutUser(): Observable<any> {
    return this.http.get(`${this.url}/users/signout`, {}).pipe(
      tap(() => {
        this.notification.showSuccess("Sign out successful");
        this.handleLogout();
      })
    );
  }

  private handleAuthentication(
    id: string,
    email: string,
    token: string,
    role: UserRole[]
  ): void {
    const user = new LoginResponse(id, email, token, role);
    this.setUser(user);
    this.user.next(user);
  }

  handleLogout(): void {
    this.removeUser();
    this.user.next(null);
    this.isAuthenticated = false;
    this.router.navigate(["/login"]);
  }

  private setUser(user: LoginResponse): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  private removeUser(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
  }
}
