import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthComponent } from "./shared/components/auth/auth.component";
import { HomeComponent } from "./shared/components/home/home.component";
import { BillComponent } from "./shared/components/bill/bill.component";
import { ProjectComponent } from "./shared/components/project/project-list/project.component";
import { UserComponent } from "./shared/components/user/user-profile/user.component";
import { CalendarComponent } from "./shared/components/calendar/calendar.component";

import { AuthGuard } from "./shared/services/auth.guard";
import { UserRole } from "./shared/enums/userRole.enum";
import { UsersListComponent } from "./shared/components/user/users-list/users-list.component";
import { ProjectInfoComponent } from "./shared/components/project/project-info/project-info.component";

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
    path: "projects/:id",
    component: ProjectInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    component: UsersListComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [UserRole.ADMIN],
    },
  },
  {
    path: "user/:id",
    component: UserComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
