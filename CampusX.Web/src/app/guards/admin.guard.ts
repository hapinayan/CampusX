import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (token && role === 'Admin') {
    return true;
  }

  return router.createUrlTree(['/admin-login']);
};