import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceService } from './province.service'; 
import { ProvinceController } from './province.controller'; 
import { Province } from '../entities/province.entity';
import { Country } from '../entities/country.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Province, Country]), // Registrar Province y Country con TypeORM
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
  exports: [ProvinceService], 
})
export class ProvinceModule {} 
