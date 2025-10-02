
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity'; 
import { City } from '../city/city.entity';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const page = Number(paginationDto.page) || 1;
    const itemsPerPage = Number(paginationDto.itemsPerPage) || 5;
    const skip = (page - 1) * itemsPerPage;
    const [persons, total] = await this.personRepository.findAndCount({
      relations: ['city', 'city.province', 'city.province.country'],
      order: { id: 'ASC' }, take: itemsPerPage, skip: skip,
    });
    const totalPages = Math.ceil(total / itemsPerPage);
    return { content: persons, totalElements: total, totalPages, currentPage: Number(page), pageSize: persons.length };
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({ where: { id }, relations: ['city', 'city.province', 'city.province.country'] });
    if (!person) throw new NotFoundException(`Person with ID "${id}" not found`);
    return person;
  }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const { firstName, lastName, dni, cityId, email, birthDate } = createPersonDto;
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) throw new NotFoundException(`City with ID "${cityId}" not found`);

    const newPerson = this.personRepository.create({
      firstName, lastName, dni, email, birthDate, city,
    });

    try {
      return await this.personRepository.save(newPerson);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Ya existe una persona con ese DNI o Email');
      }
      throw error;
    }
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const personToUpdate = await this.findOne(id);
    const { cityId, ...restOfDto } = updatePersonDto;
    if (cityId) {
      const newCity = await this.cityRepository.findOneBy({ id: cityId });
      if (!newCity) throw new NotFoundException(`City with ID "${cityId}" not found`);
      Object.assign(personToUpdate, restOfDto, { city: newCity });
    } else {
      Object.assign(personToUpdate, restOfDto);
    }
    try {
      return await this.personRepository.save(personToUpdate);
    } catch (error) {
      if ((error as any).code === '23505') throw new ConflictException('El DNI o Email ya está en uso');
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.personRepository.delete(id);
  }
}