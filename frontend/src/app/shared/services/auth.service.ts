import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginResponse } from '../models/loginResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8081';
 
  constructor(private http: HttpClient) {
    // axios.defaults.headers.post['Content-Type'] = 'application/json';
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


  loginUser<T>(username: T, password: T): Observable<LoginResponse> {
      const payload: any = {
        username: username,
        password: password
      };

      return this.http.post<LoginResponse>(`${this.url}/users/signin`, payload);
  }
}
