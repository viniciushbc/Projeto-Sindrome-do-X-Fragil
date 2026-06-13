import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // Só faz logout se for 401 E o usuário estava autenticado
      // Evita falso positivo de rotas que têm fallback local
      if (error.status === 401 && authService.autenticado()) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sessaoExpirada: '1' } });
      }
      return throwError(() => error);
    })
  );
};