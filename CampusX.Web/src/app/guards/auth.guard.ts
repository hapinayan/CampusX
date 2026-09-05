import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (token && role === 'Student') {
    return true;
  }

  return router.createUrlTree(['/login']);
};