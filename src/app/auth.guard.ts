import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { MenuService } from './services/menu.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const menuService = inject(MenuService); // Inyecta el MenuService

  if (authService.isTokenExpired()) {
    authService.localLogout(); // Logout y limpieza del token
    return false;
  }

  if (authService.isLoggedIn()) {
    if (!authService.getUserId()) {
      authService.loadUserData().subscribe((userData) => {
        if (!userData) {
          router.navigate(['./login']);
        }
      });
    }

    if (authService.getRenovarPass()) {
      router.navigate(['./login']);
      return false;
    }

    if (route.routeConfig && route.routeConfig.path == ''){
      return true;
    }

    if (route.routeConfig && route.routeConfig.path == 'home'){
      return true;
    }

    const canAccess = menuService.canActivate(route.routeConfig?.path || '');
    if (!canAccess) {
      router.navigate(['./home']);
      return false;
    }


    return true; // Si pasa todas las verificaciones
  } else {
    router.navigate(['./login']);
    return false;
  }
};
