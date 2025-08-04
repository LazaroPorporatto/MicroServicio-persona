// RUTA: src/auth/auth.module.ts
// --- CÓDIGO FINAL, PRECISO Y SIN ERRORES ---

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller'; // Importa tu controlador
import { UsersModule } from 'src/users/users.module'; // Importa el módulo que provee UsersService
import { JwtStrategy } from './jwt.strategy';     // Importa tu estrategia JWT

@Module({
  imports: [
    // 1. Al importar UsersModule, permitimos que AuthController
    //    pueda inyectar UsersService correctamente.
    UsersModule,
    
    // 2. Configura Passport para usar la estrategia 'jwt' por defecto.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // 3. Configura el módulo JWT de forma asíncrona para poder usar ConfigService
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
  // 4. Declara el controlador que pertenece a este módulo.
  controllers: [AuthController],
  
  // 5. Declara los servicios/estrategias que este módulo provee.
  //    No hay AuthService aquí, lo cual es correcto para tu arquitectura.
  providers: [JwtStrategy],
  
  // 6. Exporta módulos/providers para que otros módulos puedan usarlos.
  //    Esencial para que los Guards funcionen en toda la aplicación.
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}