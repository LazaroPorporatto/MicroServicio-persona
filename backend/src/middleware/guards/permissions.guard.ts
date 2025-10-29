import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los permisos requeridos para la ruta 
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no requiere ningún permiso, permite el acceso.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Obtener el usuario del objeto request.
    // El JwtAuthGuard ya hizo su trabajo y adjuntó el usuario aquí.
    const { user } = context.switchToHttp().getRequest();

    // Si por alguna razón no hay usuario o no tiene permisos, denegar.
    if (!user || !user.permissions) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción.');
    }

    // Comprobar si el usuario tiene al menos uno de los permisos requeridos.
    // Usamos `some` que es muy eficiente. Se detiene ni bien como encuentra una coincidencia.
    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );

    if (hasPermission) {
      return true; // Permiso concedido
    }

    // Si el bucle termina y no se encontró ningún permiso coincidente, denegar acceso.
    throw new ForbiddenException('No tienes los permisos necesarios para este recurso.');
  }
}