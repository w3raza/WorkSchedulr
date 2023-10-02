import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { SuccessSnackBarComponent } from "../components/success-snack-bar.component";
import { ErrorSnackBarComponent } from "../components/error-snack-bar.component";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.openFromComponent(SuccessSnackBarComponent, {
      data: message,
      duration: duration,
      panelClass: ["success-snackbar"],
      verticalPosition: "top",
    });
  }

  showError(message: string, duration: number = 3000): void {
    this.snackBar.openFromComponent(ErrorSnackBarComponent, {
      data: message,
      duration: duration,
      panelClass: ["error-snackbar"],
      verticalPosition: "top",
    });
  }
}
