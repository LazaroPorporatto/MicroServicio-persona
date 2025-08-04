import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreatePersonDto {

  // Campos opcionales para crear una persona
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  // Campos OBLIGATORIOS para LOGIN y REGISTRO 
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // El login y el registro necesitan la contraseña.
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Campo opcional para que el LOGIN funcione 
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsOptional()
  @IsDateString()
  birthDate?: string; 
}