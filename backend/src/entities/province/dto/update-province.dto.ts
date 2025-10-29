import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinceDto } from './create-province.dto';

// PartialType crea una nueva clase con todas las propiedades de CreateProvinceDto,
// pero marcadas como opcionales. Ideal para PATCH.
export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}