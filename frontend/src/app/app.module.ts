import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FullCalendarModule } from "@fullcalendar/angular";

import { AppRoutingModule } from "./app-routing.module";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./shared/interceptors/auth.interceptor";
import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";

import { ForRolesDirective } from "./shared/directives/ForRolesDirective";

import { AppComponent } from "./app.component";
import { AuthComponent } from "./shared/components/auth/auth.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { HomeComponent } from "./shared/components/home/home.component";
import { BillComponent } from "./shared/components/bill/bill.component";
import { SuccessSnackBarComponent } from "./shared/components/snack-bar/success-snack-bar.component";
import { ErrorSnackBarComponent } from "./shared/components/snack-bar/error-snack-bar.component";
import { UserComponent } from "./shared/components/user/user.component";
import { CalendarComponent } from "./shared/components/calendar/calendar.component";
import { ProjectComponent } from "./shared/components/project/project.component";
import { UsersListComponent } from "./shared/components/user/users-list/users-list.component";
import { UserProfileComponent } from "./shared/components/user/user-profile/user-profile.component";
import { UserCreateComponent } from "./shared/components/user/user-create/user-create.component";
import { ProjectCardComponent } from "./shared/components/project/project-card/project-card.component";
import { ProjectInfoComponent } from "./shared/components/project/project-info/project-info.component";
import { ConfirmDialogComponent } from "./shared/components/confirm-dialog/confirm-dialog.component";

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
    UserCreateComponent,
    ProjectCardComponent,
    ProjectInfoComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
