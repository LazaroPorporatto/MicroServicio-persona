// RUTA: src/app/services/auth.service.ts
// --- CÓDIGO FINAL LISTO PARA COPIAR Y PEGAR ---

import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

// Interfaz para definir la estructura del token decodificado
interface DecodedToken {
  email: string;
  sub: number; // ID del usuario
  permissions: string[];
  iat: number; // Issued At
  exp: number; // Expiration Time
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private decodedToken: DecodedToken | null = null;

  constructor() {
    // Intenta cargar el token del localStorage en cuanto se inicia el servicio
    this.loadTokenFromStorage();
  }

  /**
   * Guarda el token en localStorage y lo decodifica para usarlo en la aplicación.
   * Este método debe ser llamado DESPUÉS de un login exitoso.
   * @param token El token JWT recibido del backend.
   */
  public saveTokenAndDecode(token: string): void {
    if (!token) {
      console.error('Intento de guardar un token nulo o vacío.');
      return;
    }
    localStorage.setItem('authToken', token);
    this.decodeToken(token);
  }

  /**
   * Intenta cargar y decodificar un token existente desde el localStorage.
   * Útil para mantener la sesión del usuario cuando recarga la página.
   */
  private loadTokenFromStorage(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.decodeToken(token);
    }
  }

  /**
   * Decodifica un token JWT, lo almacena en el servicio y maneja errores.
   * @param token El token a decodificar.
   */
  private decodeToken(token: string): void {
    try {
      this.decodedToken = jwtDecode<DecodedToken>(token);
      
      // Comprobación de seguridad: si el token ha expirado, cerramos la sesión.
      const isExpired = this.decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn("El token ha expirado. Limpiando sesión.");
        this.logout();
      }
    } catch (error) {
      console.error("El token es inválido. Limpiando sesión.", error);
      this.logout(); // Si el token no se puede decodificar, es inválido.
    }
  }

  /**
   * Verifica si el usuario logueado tiene un permiso específico.
   * @param permission El nombre del permiso a verificar (ej. 'editar_personas').
   * @returns `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  public hasPermission(permission: string): boolean {
    if (!this.decodedToken || !Array.isArray(this.decodedToken.permissions)) {
      return false;
    }
    return this.decodedToken.permissions.includes(permission);
  }

  /**
   * Verifica si hay un usuario logueado (es decir, si hay un token válido).
   */
  public isLoggedIn(): boolean {
    return !!this.decodedToken;
  }

  /**
   * Limpia el token de localStorage y del estado del servicio, cerrando la sesión.
   */
  public logout(): void {
    localStorage.removeItem('authToken');
    this.decodedToken = null;
  }
}