import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la provincia no puede estar vacío.' })
  name: string;

  @IsNumber({}, { message: 'El ID del país debe ser un número.' })
  @IsInt({ message: 'El ID del país debe ser un número entero.' })
  @IsNotEmpty({ message: 'El ID del país no puede estar vacío.' })
  countryId: number;
}
