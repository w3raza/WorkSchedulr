import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.getAuthenticated() == true) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};
