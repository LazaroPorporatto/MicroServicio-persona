import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleEntity } from 'src/entities/roles.entity'; 
import { PermissionEntity } from 'src/entities/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity]) 
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // <-- Opcional, por si se usa fuera
})
export class RolesModule {}
