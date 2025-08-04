import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Province } from '../entities/province.entity';
import { CreateCityDto } from './CreateCityDto.dto';
import { UpdateCityDto } from './update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
    @InjectRepository(Province)
    private provinceRepo: Repository<Province>,
  ) {}

  async create(dto: CreateCityDto): Promise<City> {
    const province = await this.provinceRepo.findOne({
      where: { id: dto.provinceId },
    });

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    const city = this.cityRepo.create({
      name: dto.name,
      province // Solo asignamos la entidad, TypeORM manejará el ID automáticamente
    });

    return this.cityRepo.save(city);
  }

  findAll(): Promise<City[]> {
    return this.cityRepo.find({ 
      relations: ['province', 'province.country'] 
    });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async update(id: number, dto: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id); // Reutilizamos el findOne que ya carga las relaciones
    
    if (dto.name !== undefined) {
      city.name = dto.name;
    }

    if (dto.provinceId !== undefined) { // Corregido typo: provinceId (antes decía provinceId)
      const province = await this.provinceRepo.findOne({
        where: { id: dto.provinceId },
      });
      if (!province) {
        throw new NotFoundException('Province not found');
      }
      city.province = province;
    }

    await this.cityRepo.save(city);
    return this.findOne(id); // Devuelve la ciudad actualizada con relaciones
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.cityRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('City not found');
    }
    return { message: 'City has been deleted' };
  }
}