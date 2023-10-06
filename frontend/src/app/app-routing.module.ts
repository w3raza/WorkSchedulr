import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";
import { HomeComponent } from "./home/home.component";
import { BillComponent } from "./bill/bill.component";
import { ProjectComponent } from "./project/project.component";
import { UserComponent } from "./user/user.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { EmployeeComponent } from "./employee/employee.component";

import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: AuthComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "calendar",
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bills",
    component: BillComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "projects",
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "employees",
    component: EmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
