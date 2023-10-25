import { Component, Inject } from "@angular/core";
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from "@angular/material/snack-bar";

@Component({
  selector: "error-snack-bar",
  templateUrl: "./error-snack-bar.component.html",
  styles: [
    `
      .snack-bar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .close-button {
        margin-left: 15px;
        position: absolute;
        right: 0;
        top: 0;
      }
    `,
  ],
})
export class ErrorSnackBarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<ErrorSnackBarComponent>
  ) {}
}
