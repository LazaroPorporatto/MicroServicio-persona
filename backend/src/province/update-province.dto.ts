import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinceDto } from './create-province.dto'; // <<-- Debe apuntar al mismo directorio
import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  countryId?: number;
}
