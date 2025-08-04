// src/province/province.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './province.entity';
import { Country } from '../country/country.entity';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto'; // <-- Importar el nuevo DTO

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(dto: CreateProvinceDto): Promise<Province> {
    const country = await this.countryRepository.findOneBy({ id: dto.countryId });
    if (!country) {
      throw new NotFoundException(`Country with ID "${dto.countryId}" not found`);
    }
    const newProvince = this.provinceRepository.create({ name: dto.name, country });
    return this.provinceRepository.save(newProvince);
  }

  async findAll(): Promise<Province[]> {
    return this.provinceRepository.find({ relations: ['country'] });
  }

  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({
      where: { id },
      relations: ['country'],
    });
    if (!province) {
      throw new NotFoundException(`Province with ID "${id}" not found`);
    }
    return province;
  }

  /**
   * Actualiza parcialmente una provincia (para PATCH).
   */
  async update(id: number, updateDto: UpdateProvinceDto): Promise<Province> {
    const provinceToUpdate = await this.findOne(id); // Reutiliza findOne para buscar y manejar 404
    const { countryId, ...restOfDto } = updateDto;

    if (countryId) {
      const newCountry = await this.countryRepository.findOneBy({ id: countryId });
      if (!newCountry) {
        throw new NotFoundException(`Country with ID "${countryId}" not found`);
      }
      provinceToUpdate.country = newCountry;
    }

    Object.assign(provinceToUpdate, restOfDto);
    return this.provinceRepository.save(provinceToUpdate);
  }

  /**
   * Reemplaza completamente una provincia (para PUT).
   */
  async replace(id: number, createDto: CreateProvinceDto): Promise<Province> {
    const provinceToUpdate = await this.findOne(id);
    const { name, countryId } = createDto;

    const country = await this.countryRepository.findOneBy({ id: countryId });
    if (!country) {
      throw new NotFoundException(`Country with ID "${countryId}" not found`);
    }

    provinceToUpdate.name = name;
    provinceToUpdate.country = country;
    return this.provinceRepository.save(provinceToUpdate);
  }

  /**
   * Elimina una provincia por su ID.
   */
  async remove(id: number): Promise<void> {
    const provinceToRemove = await this.findOne(id); // Confirma que existe antes de borrar
    await this.provinceRepository.remove(provinceToRemove);
  }
}