// src/city/dto/update-city.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';

// PartialType toma todas las propiedades de CreateCityDto
// y las convierte en opcionales.
export class UpdateCityDto extends PartialType(CreateCityDto) {}