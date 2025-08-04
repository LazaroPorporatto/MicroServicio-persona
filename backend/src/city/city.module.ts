import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityService } from '../entities/city/city.service';
import { CityController } from '../entities/city/city.controller';
import { City } from '../entities/city/city.entity';
import { Province } from '../entities/province/province.entity';

@Module({
  imports: [
    // Hacemos disponibles los repositorios de City y Province para el CityService
    TypeOrmModule.forFeature([City, Province])
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}