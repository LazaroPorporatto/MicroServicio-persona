import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { CityModule } from '../city/city.module'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([Person]), 
    CityModule,
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonModule {}