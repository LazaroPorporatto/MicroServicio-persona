import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  countryId: number; // ID del país al que pertenece
}