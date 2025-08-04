import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization'];
        if (!token) throw new UnauthorizedException('No token provided');

        try {
            const response = await axios.post('http://localhost:3000/auth/my-permissions', {
                permissions: requiredPermissions,
            }, {
                headers: { Authorization: token },
            });

            if (response.data && response.data.allowed) {
                return true;
            }
            throw new ForbiddenException('No tienes permisos suficientes');
        } catch (err) {
            throw new ForbiddenException('Error de autenticación');
        }
    }
}