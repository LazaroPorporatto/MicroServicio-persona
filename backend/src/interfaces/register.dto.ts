import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsDateString 
} from 'class-validator';

export class RegisterDTO {
  
  // Datos para la cuenta de USUARIO
  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  password: string;

  // Datos para el perfil de PERSONA 
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El DNI no puede estar vacío.' })
  dni: string;

  @IsNumber({}, { message: 'El ID de la ciudad debe ser un número.' })
  @IsNotEmpty({ message: 'El ID de la ciudad no puede estar vacío.' })
  cityId: number;

  @IsOptional() // La fecha de nacimiento es opcional
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida.' })
  birthDate?: string; // Se recibe como string 'YYYY-MM-DD'
}