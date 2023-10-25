import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthComponent } from "./shared/components/auth/auth.component";
import { HomeComponent } from "./shared/components/home/home.component";
import { BillComponent } from "./shared/components/bill/bill.component";
import { ProjectComponent } from "./shared/components/project/project.component";
import { UserComponent } from "./shared/components/user/user.component";
import { CalendarComponent } from "./shared/components/calendar/calendar.component";

import { AuthGuard } from "./shared/services/auth.guard";
import { UserRole } from "./shared/enums/user-role.enum";
import { UsersListComponent } from "./shared/components/user/users-list/users-list.component";
import { UserProfileComponent } from "./shared/components/user/user-profile/user-profile.component";

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
