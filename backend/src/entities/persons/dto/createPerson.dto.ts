import { IsString, IsNotEmpty, IsEmail, IsDateString, IsNumber } from 'class-validator';

// DTO estricto para el CRUD de Personas.
export class CreatePersonDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  dni: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsDateString({}, { message: 'La fecha de nacimiento debe tener el formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthDate: string;

  @IsNumber({}, { message: 'El ID de la ciudad debe ser un número' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  cityId: number;
}