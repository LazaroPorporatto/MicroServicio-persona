import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../auth/guards/permissions.guard'; 
import { Permissions } from '../auth/decorators/permissions.decorator';  
// import { UsersService } from './users.service'; // lo dejo aca por las dudas lo tengamos que usar chicuelos

@Controller('users') // Ejemplo de un controlador de usuarios
export class UsersController {
  // constructor(private readonly usersService: UsersService) {} // cuando usemos un servicio, descomentar

  @Get()
  @UseGuards(PermissionsGuard) // Aplica el PermissionsGuard a este método
  @Permissions('read:users', 'admin:access') // Define los permisos necesarios para acceder aca
  findAll() {
    return { message: 'Lista de todos los usuarios - Acceso concedido!' };
  }

  @Get('profile')
  @UseGuards(PermissionsGuard) // Aplica el Guard
  @Permissions('read:profile') // Otros permisos para este endpoint
  findProfile() {
    return { message: 'Este es tu perfil de usuario.' };
  }

  @Get('dashboard')
  @UseGuards(PermissionsGuard) // Aplica el Guard
  @Permissions('view:dashboard') // Otros permisos para este endpoint
  getDashboardData() {
    return { message: 'Estos son datos sensibles del panel de control.' };
  }
}
