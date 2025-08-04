// RUTA: src/app/app.config.ts
// --- CÓDIGO CORRECTO ---

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor'; // Asegúrate de que esta ruta es correcta

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Esto le dice a Angular que use tu interceptor para todas las peticiones HTTP.
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};