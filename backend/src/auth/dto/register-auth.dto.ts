// RUTA: src/auth/dto/register-auth.dto.ts
// --- CÓDIGO NUEVO, LISTO PARA COPIAR Y PEGAR ---

import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El DNI no puede estar vacío.' })
  dni: string;

  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  password: string;

  @IsNumber({}, { message: 'El ID de la ciudad debe ser un número.' })
  @IsNotEmpty({ message: 'El ID de la ciudad no puede estar vacío.' })
  cityId: number;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}