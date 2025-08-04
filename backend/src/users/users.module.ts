import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// Entidades
import { UserEntity } from 'src/entities/users.entity';
import { RoleEntity } from 'src/entities/roles.entity';
import { Person } from 'src/entities/persons/person.entity';
import { City } from 'src/entities/city/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, 
      RoleEntity, 
      Person, 
      City
    ]),
    
    // Configuracion de JwtModule para que UsersService pueda usar JwtService con la clave secreta.
    JwtModule.registerAsync({
      imports: [ConfigModule], // Necesario para inyectar ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}