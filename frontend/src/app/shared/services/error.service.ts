import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  constructor(private notificationService: NotificationService) {}

  handleError(error: HttpErrorResponse) {
    const errorMessage = this.getErrorMessage(error);
    this.notificationService.showError(errorMessage);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Error: ${error.error.message}`;
    }

    switch (error.status) {
      case 401:
        return "You are signed out";
      case 503:
        return "Service Unavailable";
      default:
        return `${error.message}`;
    }
  }
}
