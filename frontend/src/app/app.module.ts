import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FullCalendarModule } from "@fullcalendar/angular";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { BillComponent } from "./bill/bill.component";
import { SuccessSnackBarComponent } from "./shared/components/success-snack-bar.component";
import { ErrorSnackBarComponent } from "./shared/components/error-snack-bar.component";
import { UserComponent } from "./user/user.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ProjectComponent } from "./project/project.component";
import { EmployeeComponent } from "./employee/employee.component";

import { AuthInterceptor } from "./shared/interceptors/auth.interceptor";
import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    HomeComponent,
    BillComponent,
    SuccessSnackBarComponent,
    ErrorSnackBarComponent,
    UserComponent,
    CalendarComponent,
    ProjectComponent,
    EmployeeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
