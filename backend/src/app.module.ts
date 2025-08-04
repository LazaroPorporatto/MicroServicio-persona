import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controladores y Servicios Principales
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos de nuestra Aplicación
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PersonModule } from './entities/persons/persons.module';
import { CityModule } from './entities/city/city.module';
import { ProvinceModule } from './entities/province/province.module';
import { CountryModule } from './entities/country/country.module';
import { SeederModule } from './database/seeder.module';

// TODAS nuestras Entidades
import { UserEntity } from './entities/users.entity';
import { RoleEntity } from './entities/roles.entity';
import { PermissionEntity } from './entities/permissions.entity';
import { Person } from './entities/persons/person.entity';
import { City } from './entities/city/city.entity';
import { Province } from './entities/province/province.entity';
import { Country } from './entities/country/country.entity';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Conexión a la base de datos con TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [ UserEntity, RoleEntity, PermissionEntity, Person, City, Province, Country ],
        autoLoadEntities: false, 
        synchronize: true, 
      }),
      inject: [ConfigService],
    }),

    // Módulos que componen nuestra app
    SeederModule, 
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    PersonModule,
    CityModule,
    ProvinceModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}