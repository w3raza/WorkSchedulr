// import { HttpErrorResponse } from "@angular/common/http";
// import { Injectable, EventEmitter } from "@angular/core";
// import { Subject } from "rxjs";

// @Injectable({
//   providedIn: "root",
// })
// export class ErrorService {
//   private _notifyOnErrors = new Subject<string>();
//   notifyOnErrors$ = this._notifyOnErrors.asObservable();

//   handleError(error: HttpErrorResponse) {
//     let errorMessage = "Wystąpił nieznany błąd!";

//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Błąd: ${error.error.message}`;
//     } else {
//       switch (error.status) {
//         case 401:
//           errorMessage = "Nieautoryzowany dostęp. Proszę się zalogować.";
//           break;
//         default:
//           errorMessage = `Kod błędu: ${error.status}\nWiadomość: ${error.message}`;
//       }
//     }

//     this._notifyOnErrors.next(errorMessage);
//   }
// }
