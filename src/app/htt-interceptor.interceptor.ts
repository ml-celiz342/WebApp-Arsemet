import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TimeoutError, catchError, timeout, throwError } from 'rxjs';
import { AuthService } from './auth.service'; // Importa tu servicio de autenticación

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inyección de dependencias en un interceptor funcional
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService); // Inyectamos el AuthService
  const REQUEST_TIMEOUT = 10000; // Timeout en milisegundos (10 segundos)

  // Obtener el token de autenticación
  const token = authService.getToken();

  // Si el token está disponible, lo agregamos a las cabeceras
  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Agregar el token en el header Authorization
      },
    });
  }

  return next(modifiedReq).pipe(
    timeout(REQUEST_TIMEOUT), // Interrumpe solicitudes que demoren más de 10 segundos
    catchError((error) => {
      if (error instanceof TimeoutError) {
        // Manejo de errores de timeout
        console.error('Error de timeout: La solicitud tardó demasiado.');
        snackBar.open(
          'La solicitud tardó demasiado en responder. Intente nuevamente.',
          'Cerrar',
          { duration: 3000 }
        );
      } else if (error.status === 401) {
        // Manejo de errores 401 (no autorizado)
        console.warn('Error 401: Sesión expirada o no autorizado.');
        snackBar.open(
          'Sesión expirada. Por favor vuelva a iniciar sesión.',
          'Cerrar',
          { duration: 3000 }
        );

        // Verificar si la ruta actual no es '/login' antes de redirigir
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        // Manejo de errores 403 (acceso prohibido)
        console.warn('Error 403: Acceso prohibido.');
        snackBar.open(
          'No tienes permiso para realizar esta acción.',
          'Cerrar',
          { duration: 3000 }
        );
      } else if (error.status === 500) {
        // Manejo de errores 500 (error interno del servidor)
        console.error('Error 500: Error interno del servidor.');
        snackBar.open('Error en el servidor. Intente más tarde.', 'Cerrar', {
          duration: 3000,
        });
      } else {
        // Manejo de otros errores HTTP o desconocidos
        console.error(
          `Error ${error.status || 'desconocido'}: ${error.message}`
        );
        const esImagen = req.url.includes('data/img/');
        if (!esImagen) {
          snackBar.open(
            'Ocurrió un error inesperado. Intente nuevamente.',
            'Cerrar',
            { duration: 3000 }
          );
        }
      }

      return throwError(() => error);
    })
  );

};
