// --- CÓDIGO NUEVO, LISTO PARA COPIAR Y PEGAR ---

import { HttpInterceptorFn } from '@angular/common/http';

// Esta es una función interceptora, no una clase. Es el enfoque moderno para Standalone.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtenemos el token del localStorage.
  const token = localStorage.getItem('authToken');

  // 2. Si no hay token, simplemente continuamos con la petición original.
  if (!token) {
    return next(req);
  }

  // 3. Si hay un token, clonamos la petición para añadirle la cabecera.
  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // 4. Pasamos la petición clonada (con el token) al siguiente manejador.
  return next(clonedRequest);
};