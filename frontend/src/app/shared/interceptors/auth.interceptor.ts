import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext,
} from "@angular/common/http";
import { Observable } from "rxjs";

const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export function skipAuth() {
  return new HttpContext().set(SKIP_AUTH, true);
}

export function getAuthToken(): string | null {
  return window.localStorage.getItem("auth_token");
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.context.get(SKIP_AUTH)) {
      return next.handle(request);
    }

    const token = getAuthToken();
    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${token}`),
      });
    }

    return next.handle(request);
  }
}
