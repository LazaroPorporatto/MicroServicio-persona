// Lo hago para evitar repetiir el codigo!
// Dado que UpdatePersonDto hereda de CreatePersonDto, 
// el cambio que ya hicimos en createPerson.dto.ts 
// se propagará automáticamente a UpdatePersonDto.
import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './createPerson.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}