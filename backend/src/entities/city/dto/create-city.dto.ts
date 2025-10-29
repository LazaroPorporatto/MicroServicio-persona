import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    provinceId: number; // Solo necesitamos el ID de la provincia
}