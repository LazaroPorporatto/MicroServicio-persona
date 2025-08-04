// src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Asegúrate de tener esto
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleEntity } from 'src/entities/roles.entity'; // <-- Importa correctamente
import { PermissionEntity } from 'src/entities/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity]) // <-- ¡AQUÍ ESTÁ LA CLAVE!
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // <-- Opcional, por si se usa fuera
})
export class RolesModule {}
