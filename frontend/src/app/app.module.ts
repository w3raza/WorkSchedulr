import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
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

import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";
import { ForRolesDirective } from "./shared/directives/ForRolesDirective";
import { UsersListComponent } from "./user/users-list/users-list.component";
import { UserProfileComponent } from "./user/user-profile/user-profile.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    ForRolesDirective,
    HomeComponent,
    BillComponent,
    SuccessSnackBarComponent,
    ErrorSnackBarComponent,
    UserComponent,
    CalendarComponent,
    ProjectComponent,
    UsersListComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
