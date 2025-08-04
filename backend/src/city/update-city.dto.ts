import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCityDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  provinceId?: number;
}
