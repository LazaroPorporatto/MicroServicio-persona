import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './province.entity';
// Importa el módulo completo, no solo la entidad
import { CountryModule } from '../country/country.module'; 
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';

@Module({
  imports: [
    // 1. Importa el CountryModule para tener acceso a CountryRepository
    CountryModule,
    // 2. Registra únicamente la entidad que le pertenece a ESTE módulo: Province
    TypeOrmModule.forFeature([Province]),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}