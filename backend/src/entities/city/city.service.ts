// src/city/city.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { Province } from '../province/province.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const { name, provinceId } = createCityDto;
    const province = await this.provinceRepository.findOneBy({ id: provinceId });
    if (!province) {
      throw new NotFoundException(`La provincia con ID ${provinceId} no fue encontrada.`);
    }
    const newCity = this.cityRepository.create({ name, province });
    return this.cityRepository.save(newCity);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find({ relations: ['province', 'province.country'] });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['province', 'province.country'],
    });
    if (!city) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada.`);
    }
    return city;
  }

  /**
   * Actualiza parcialmente una ciudad por su ID (para PATCH).
   */
  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const cityToUpdate = await this.findOne(id); // Reutiliza findOne para buscar y manejar 404
    const { provinceId, ...restOfDto } = updateCityDto;

    // Si se envía un nuevo provinceId, se valida y actualiza la relación
    if (provinceId) {
      const newProvince = await this.provinceRepository.findOneBy({ id: provinceId });
      if (!newProvince) {
        throw new NotFoundException(`La provincia con ID ${provinceId} no fue encontrada.`);
      }
      cityToUpdate.province = newProvince;
    }

    // Se fusionan los demás datos (ej: name) con la entidad existente
    Object.assign(cityToUpdate, restOfDto);
    return this.cityRepository.save(cityToUpdate);
  }

  /**
   * Reemplaza completamente una ciudad por su ID (para PUT).
   */
  async replace(id: number, createCityDto: CreateCityDto): Promise<City> {
    const cityToUpdate = await this.findOne(id);
    const { name, provinceId } = createCityDto;

    const province = await this.provinceRepository.findOneBy({ id: provinceId });
    if (!province) {
      throw new NotFoundException(`La provincia con ID ${provinceId} no fue encontrada.`);
    }

    // Se asignan todos los nuevos valores, reemplazando los anteriores
    cityToUpdate.name = name;
    cityToUpdate.province = province;

    return this.cityRepository.save(cityToUpdate);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada.`);
    }
  }
}