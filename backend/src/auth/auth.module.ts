import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'; 
import { JwtStrategy } from './jwt.strategy';    

@Module({
  imports: [
    // Al importar UsersModule, permitimos que AuthController
    //    pueda inyectar UsersService correctamente.
    UsersModule,
    
    // Configura Passport para usar la estrategia 'jwt' por defecto.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configura el módulo JWT de forma asíncrona para poder usar ConfigService
    //    y leer la clave secreta desde las variables de entorno.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // El token expira en 1 hora
      }),
      inject: [ConfigService],
    }),
  ],
  // Declara el controlador que pertenece a este módulo.
  controllers: [AuthController],
  
  // Declara los servicios/estrategias que este módulo provee.
  //    No hay AuthService aquí, lo cual es correcto para nuestra arquitectura.
  providers: [JwtStrategy],
  
  // Exporta módulos/providers para que otros módulos puedan usarlos.
  //    Esencial para que los Guards funcionen en toda la aplicación.
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}