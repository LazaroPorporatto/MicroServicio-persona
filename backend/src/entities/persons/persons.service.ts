import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { City } from '../city/city.entity';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  findAll(): Promise<Person[]> {
    return this.personRepository.find();
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({ 
      where: { id },
      relations: ['city', 'city.province', 'city.province.country'],
    });
    if (!person) {
      throw new NotFoundException(`Person with ID "${id}" not found`);
    }
    return person;
  }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const { firstName, lastName, dni, cityId, email, birthDate } = createPersonDto;
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) {
      throw new NotFoundException(`City with ID "${cityId}" not found`);
    }

    const newPerson = this.personRepository.create({
      firstName,
      lastName,
      dni,
      email,
      birthDate,
      city
    });

    try {
      return await this.personRepository.save(newPerson);
    } catch (error) {
      if (error.code === '23505') { // Código de error de PostgreSQL para violación de unicidad
        throw new ConflictException('Ya existe una persona con ese DNI o Email');
      }
      throw error;
    }
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const personToUpdate = await this.findOne(id);
    if (!updatePersonDto || Object.keys(updatePersonDto).length === 0) {
      return personToUpdate;
    }
    const { cityId, ...restOfDto } = updatePersonDto;
    if (cityId) {
      const newCity = await this.cityRepository.findOneBy({ id: cityId });
      if (!newCity) {
        throw new NotFoundException(`City with ID "${cityId}" not found`);
      }
      Object.assign(personToUpdate, restOfDto, { city: newCity });
    } else {
      Object.assign(personToUpdate, restOfDto);
    }
    try {
        return await this.personRepository.save(personToUpdate);
    } catch (error) {
        if (error.code === '23505') {
            throw new ConflictException('El DNI o Email ya está en uso por otra persona');
        }
        throw error;
    }
  }

  async replace(id: number, createPersonDto: CreatePersonDto): Promise<Person> {
    const personToReplace = await this.findOne(id); // Reutilizamos findOne para verificar que existe
    const { cityId, ...restOfDto } = createPersonDto;
    
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) {
      throw new NotFoundException(`City with ID "${cityId}" not found`);
    }
    
    // Asignamos todas las nuevas propiedades al objeto que encontramos
    Object.assign(personToReplace, restOfDto, { city });

    try {
        // Guardamos el objeto actualizado. TypeORM sabrá que debe hacer un UPDATE.
        return await this.personRepository.save(personToReplace);
    } catch (error) {
        if (error.code === '23505') {
            throw new ConflictException('El DNI o Email ya está en uso por otra persona');
        }
        throw error;
    }
  }

  async remove(id: number): Promise<void> {
    // Primero, verificamos que la persona exista. findOne arrojará un error 404 si no.
    await this.findOne(id);
    
    // Si existe, la eliminamos.
    await this.personRepository.delete(id);
  }
}