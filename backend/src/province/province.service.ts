import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../entities/province.entity';
import { CreateProvinceDto } from './create-province.dto';
import { UpdateProvinceDto } from './update-province.dto';
import { Country } from '../entities/country.entity';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(Country) // Inyectamos el repositorio de Country
    private countryRepository: Repository<Country>,
  ) {}

  // POST /province
  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const country = await this.countryRepository.findOne({
      where: { id: createProvinceDto.countryId },
    });
    if (!country) {
      throw new NotFoundException(
        `El país con ID ${createProvinceDto.countryId} no fue encontrado.`,
      );
    }

    const existingProvince = await this.provinceRepository.findOne({
      where: {
        name: createProvinceDto.name,
        country: { id: createProvinceDto.countryId }, // Para comparar por el ID de la relación
      },
    });
    if (existingProvince) {
      throw new BadRequestException(
        `La provincia '${createProvinceDto.name}' ya existe para el país con ID ${createProvinceDto.countryId}.`,
      );
    }

    const newProvince = this.provinceRepository.create({
      ...createProvinceDto,
      country, // Asignamos la entidad Country completa a la relación
    });
    return this.provinceRepository.save(newProvince);
  }

  // GET /province
  async findAll(): Promise<Province[]> {
    return this.provinceRepository.find({ relations: ['country'] });
  }

  // GET /province/:id
  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({
      where: { id },
      relations: ['country'],
    });
    if (!province) {
      throw new NotFoundException(
        `La provincia con ID ${id} no fue encontrada.`,
      );
    }
    return province;
  }

  // PUT /province/:id (Actualización completa)
  async update(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    const province = await this.findOne(id); // Reutilizamos findOne para verificar existencia

    // Si se envía un nuevo countryId, validamos que el país exista
    if (
      updateProvinceDto.countryId !== undefined &&
      updateProvinceDto.countryId !== province.countryId
    ) {
      const newCountry = await this.countryRepository.findOne({
        where: { id: updateProvinceDto.countryId },
      });
      if (!newCountry) {
        // Si el país no se encuentra, lanzamos la excepción y terminamos aquí
        throw new NotFoundException(
          `El país con ID ${updateProvinceDto.countryId} no fue encontrado.`,
        );
      }
      // Si el país se encuentra, entonces asignamos la nueva relación
      province.country = newCountry;
      province.countryId = newCountry.id; // Actualizamos el countryId en la entidad
    }

    // Actualizamos el nombre si se provee
    if (updateProvinceDto.name !== undefined) {
      province.name = updateProvinceDto.name;
    }

    // Guardar los cambios en la base de datos
    // TypeORM es inteligente y solo actualizará los campos que hayan cambiado
    const savedProvince = await this.provinceRepository.save(province);
    return this.findOne(savedProvince.id); // Reutilizamos findOne para cargar con relaciones
  }
  // PATCH /province/:id (Actualización parcial)
  async patch(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    const province = await this.findOne(id); // Reutilizamos findOne para verificar existencia

    // Si se envía un nuevo countryId, validamos que el país exista
    if (
      updateProvinceDto.countryId !== undefined &&
      updateProvinceDto.countryId !== province.countryId
    ) {
      const newCountry = await this.countryRepository.findOne({
        where: { id: updateProvinceDto.countryId },
      });

      // CORRECCIÓN para "Country | null no se puede asignar a Country" y "código inaccesible"
      if (!newCountry) {
        // Si el país no se encuentra, lanzamos la excepción y terminamos aquí
        throw new NotFoundException(
          `El país con ID ${updateProvinceDto.countryId} no fue encontrado.`,
        );
      }
      // Si el país se encuentra, entonces asignamos la nueva relación
      province.country = newCountry;
      province.countryId = newCountry.id; // Actualizamos el countryId en la entidad
    }

    // Actualizamos el nombre si se provee
    if (updateProvinceDto.name !== undefined) {
      province.name = updateProvinceDto.name;
    }

    const savedProvince = await this.provinceRepository.save(province);

    // Reutilizamos findOne para cargar con relaciones completas para la respuesta
    return this.findOne(savedProvince.id);
  }

  // DELETE /province/:id
  async remove(id: number): Promise<{ message: string }> {
    // Cambio a un objeto de mensaje
    const result = await this.provinceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `La provincia con ID ${id} no fue encontrada para eliminar.`,
      );
    }
    return { message: `deleted.` }; // Mensaje más descriptivo
  }
}
