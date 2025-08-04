// RUTA: src/entities/country/country.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService],
  // Esto hace que cualquier módulo que importe CountryModule
  // tenga acceso a los providers registrados en `imports`,
  // en este caso, al CountryRepository.
  exports: [TypeOrmModule],
})
export class CountryModule {}