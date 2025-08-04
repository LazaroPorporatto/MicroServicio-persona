import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  MinLength,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  @MinLength(3) // Ejemplo de validación, ajusta según tu necesidad
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString() // Valida que sea una cadena de fecha válida (ej: "1990-05-15")
  birthDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Asegura que cityId se convierta a número
  cityId?: number;
}
