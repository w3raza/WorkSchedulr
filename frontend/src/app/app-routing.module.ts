import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { HomeComponent } from "./home/home.component";
import { BillComponent } from "./bill/bill.component";
import { ProjectComponent } from "./project/project.component";
import { UserComponent } from "./user/user.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { EmployeeComponent } from "./employee/employee.component";

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
  },
  {
    path: "calendar",
    component: CalendarComponent,
  },
  {
    path: "bills",
    component: BillComponent,
  },
  {
    path: "projects",
    component: ProjectComponent,
  },
  {
    path: "employees",
    component: EmployeeComponent,
  },
  {
    path: "user",
    component: UserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
