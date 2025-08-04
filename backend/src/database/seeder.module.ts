// RUTA: src/database/seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { RoleEntity } from '../entities/roles.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { UserEntity } from '../entities/users.entity'; // <-- 1. IMPORTA USERENTITY

@Module({
  imports: [
    // 2. AÑADE USERENTITY A FORFEATURE
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}