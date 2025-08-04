import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token de autenticación faltante.');
    }

    const LOGIN_MICROSERVICE_URL = 'http://localhost:3000';

    try {
      this.logger.log(
        `Consultando permisos para la ruta. Requeridos: ${requiredPermissions.join(', ')}`,
      );

      // El tipo genérico de axios ahora es un array de strings directamente
      const response = await axios.get<string[]>(
        `${LOGIN_MICROSERVICE_URL}/auth/my-permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // --- CORRECCIÓN FINAL ---
      // La respuesta (response.data) ES el array de permisos.
      const userPermissions = response.data;

      if (!Array.isArray(userPermissions)) {
        this.logger.error(
          'La respuesta del servicio de autenticación no es un array. Respuesta recibida:', 
          JSON.stringify(userPermissions)
        );
        throw new UnauthorizedException(
          'Formato de respuesta de permisos inválido.',
        );
      }

      this.logger.log(
        `Permisos del usuario obtenidos: ${userPermissions.join(', ')}`,
      );

      const hasAllPermissions = requiredPermissions.every((p) =>
        userPermissions.includes(p),
      );

      if (!hasAllPermissions) {
        throw new UnauthorizedException(
          'El usuario no tiene los permisos necesarios.',
        );
      }

      return true;

    } catch (error) {
      this.logger.error('Error al verificar permisos:', error.message);
      
      if (axios.isAxiosError(error) && error.response) {
        throw new UnauthorizedException(
          error.response.data.message ||
            'Permiso denegado por el servicio de autenticación.',
        );
      }
      
      throw new UnauthorizedException('Fallo al verificar los permisos.');
    }
  }
}