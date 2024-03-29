import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  handleError(error: HttpErrorResponse) {
    const errorMessage = this.getErrorMessage(error);
    this.notificationService.showError(errorMessage);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Error: ${error.error}`;
    }

    switch (error.status) {
      case 401:
      case 403:
        this.authService.handleLogout();
        return "You are signed out";
      case 404:
        return `${error.error}` ? `${error.error}` : "No found any value";
      case 0:
      case 503:
        return "Service Unavailable";
      default:
        return `${error.error || "An unknown error occurred"}`;
    }
  }
}
