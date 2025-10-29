// carga de datos inicial
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { RoleEntity } from '../entities/roles.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { UserEntity } from '../entities/users.entity'; 

@Module({
  imports: [
    // AÑADE USERENTITY A FORFEATURE
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}