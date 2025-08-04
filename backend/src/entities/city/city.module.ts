// src/entities/city/city.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './city.entity';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { Province } from '../province/province.entity'; // <-- PASO 1: IMPORTA PROVINCE

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Province]) // <-- PASO 2: AÑADE PROVINCE A LA LISTA
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService, TypeOrmModule], 
})
export class CityModule {}