import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional() // Hacemos la página opcional para que tome el valor por defecto si no se envía
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional() // Hacemos los items opcionales para que tome el valor por defecto
  itemsPerPage?: number = 5; 
}