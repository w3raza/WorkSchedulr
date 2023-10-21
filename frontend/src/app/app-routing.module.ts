import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";
import { HomeComponent } from "./home/home.component";
import { BillComponent } from "./bill/bill.component";
import { ProjectComponent } from "./project/project.component";
import { UserComponent } from "./user/user.component";
import { CalendarComponent } from "./calendar/calendar.component";

import { AuthGuard } from "./auth/auth.guard";
import { UserRole } from "./shared/enums/user-role.enum";
import { UsersListComponent } from "./user/users-list/users-list.component";
import { UserProfileComponent } from "./user/user-profile/user-profile.component";

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
    path: "users",
    component: UsersListComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [UserRole.ADMIN],
    },
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user/:id",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [UserRole.ADMIN],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
