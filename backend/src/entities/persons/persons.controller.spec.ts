import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/createPerson.dto'; 
import { Person } from './person.entity';
import { UserEntity } from '../users.entity';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { City } from '../city/city.entity'; 
import { Province } from '../province/province.entity'; // Importa Province (si no existe, crea un mock)
import { Country } from '../country/country.entity'; // Importa Country (si no existe, crea un mock)


// ...existing code...
describe('PersonsController', () => {
  let controller: PersonsController;
  let service: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: {
            create: jest.fn() as jest.Mock,
            update: jest.fn() as jest.Mock,
            replace: jest.fn() as jest.Mock,
            remove: jest.fn() as jest.Mock,
            findAll: jest.fn() as jest.Mock,
            findOne: jest.fn() as jest.Mock,
          },
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);
  });
  describe('create', () => {
    it('deberia devolver la persona creada', async () => {
      const createDto: CreatePersonDto = {
        firstName: 'Felipe',
        lastName: 'Giovanardi',
        dni: '45405552',
        email: 'felipegiovanardi19@gmail.com',
        cityId: 2,
        birthDate: '19/01/2004',
      };

      const mockPerson: Person = {
        id: 4,
        firstName: createDto.firstName ?? '',
        lastName: createDto.lastName ?? '',
        dni: createDto.dni ?? '',
        email: createDto.email ?? '',
        birthDate: createDto.birthDate ?? '',
        city: { 
          id: 2, 
          name: 'Córdoba', 
          province: { id: 4, name: 'Córdoba', country: { id: 1, name: 'Argentina' } as Country } as Province 
        } as City,
        user: {} as UserEntity,
      };
      (service.create as jest.Mock<any>).mockResolvedValue(mockPerson);
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockPerson);
      console.log('Persona creada: ', result);
    });
  });

  describe('update', () => {
    it('deberia modificar los datos de una persona ya creada', async () => {
      const updateDto: UpdatePersonDto = {
        firstName: 'Felipe',
        lastName: 'Giovanardi',
        dni: '45405552',
        email: 'felipegiovanardi19@gmail.com',
        cityId: 2,
        birthDate: '19/01/2004',
      };

      const mockPerson: Person = {
        id: 4,
        firstName: updateDto.firstName ?? '',
        lastName: updateDto.lastName ?? '',
        dni: updateDto.dni ?? '',
        email: updateDto.email ?? '',
        birthDate: updateDto.birthDate ?? '',
        city: { 
          id: 2, 
          name: 'Córdoba', 
          province: { id: 4, name: 'Córdoba', country: { id: 1, name: 'Argentina' } as Country } as Province 
        } as City,
        user: {} as UserEntity,
      };
      (service.update as jest.Mock<any>).mockResolvedValue(mockPerson);
      const result = await controller.update(4, updateDto);
      expect(service.update).toHaveBeenCalledWith(4, updateDto);
      expect(result).toEqual(mockPerson);
      console.log('Persona modificada: ', result);
    });
  });
  describe('findAll', () => {
    it('deberia devolver una lista de personas con sus datos', async () => {
      const createDto: CreatePersonDto = {
        firstName: 'Felipe',
        lastName: 'Giovanardi',
        dni: '45405552',
        email: 'felipegiovanardi19@gmail.com',
        cityId: 2,
        birthDate: '19/01/2004',
      };

      const mockPerson: Person = {
        id: 4,
        firstName: createDto.firstName ?? '',
        lastName: createDto.lastName ?? '',
        dni: createDto.dni ?? '',
        email: createDto.email ?? '',
        birthDate: createDto.birthDate ?? '',
        city: { 
          id: 2, 
          name: 'Córdoba', 
          province: { id: 4, name: 'Córdoba', country: { id: 1, name: 'Argentina' } as Country } as Province 
        } as City,
        user: {} as UserEntity,
      };
      const personsList = [mockPerson];
      (service.findAll as jest.Mock<any>).mockResolvedValue(personsList);
      const paginationDto = { page: 1, itemsPerPage: 10 }; // Ajusta los valores según lo que esperes
      const result = await controller.findAll(paginationDto);
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(personsList);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      console.log('Lista de personas: ', result);
    });
  });
  describe('findOne', () => {
    it('deberia devolver la persona con el ID 4', async () => {
      const createDto: CreatePersonDto = {
        firstName: 'Felipe',
        lastName: 'Giovanardi',
        dni: '45405552',
        email: 'felipegiovanardi19@gmail.com',
        cityId: 2,
        birthDate: '19/01/2004',
      };

      const mockPerson: Person = {
        id: 4,
        firstName: createDto.firstName ?? '',
        lastName: createDto.lastName ?? '',
        dni: createDto.dni ?? '',
        email: createDto.email ?? '',
        birthDate: createDto.birthDate ?? '',
        city: { 
          id: 2, 
          name: 'Córdoba', 
          province: { id: 4, name: 'Córdoba', country: { id: 1, name: 'Argentina' } as Country } as Province 
        } as City,
        user: {} as UserEntity,
      };
      (service.findOne as jest.Mock<any>).mockResolvedValue(mockPerson);
      const result = await controller.findOne(4);
      expect(service.findOne).toHaveBeenCalledWith(4);
      expect(result).toEqual(mockPerson);
      console.log('Persona encontrada: ', result);
    });
  });
  describe('replace', () => {
    it('deberia de reemplazar los datos de una persona creada', async () => {
      const replacePersonDto: UpdatePersonDto = { 
        firstName: 'Felipe Updated', 
        lastName: 'Giovanardi Updated', 
        dni: '45405552',
        email: 'felipegiovanardi19_updated@gmail.com', 
        cityId: 3, 
        birthDate: '20/01/2004', 
      };
      const mockPerson: Person = {
        id: 4,
        firstName: replacePersonDto.firstName ?? '',
        lastName: replacePersonDto.lastName ?? '',
        dni: replacePersonDto.dni ?? '',
        email: replacePersonDto.email ?? '',
        birthDate: replacePersonDto.birthDate ?? '',
        city: { 
          id: 3, 
          name: 'Rosario', 
          province: { // La ciudad tiene una provincia
            id: 1, // ID de la provincia de Santa Fe
            name: 'Santa Fe', // Nombre de la provincia
            country: { id: 1, name: 'Argentina' } as Country // La provincia tiene un país
          } as Province 
        } as City, 
        user: {} as UserEntity,
      };

      (service.update as jest.Mock<any>).mockResolvedValue(mockPerson);
      const result = await controller.update(4, replacePersonDto);
      expect(service.update).toHaveBeenCalledWith(4, replacePersonDto);
      expect(result).toEqual(mockPerson);
      console.log('Datos reemplazados: ', result);
    });
  });
  describe('remove', () => {
    it('deberia de eliminar una persona creada en base al id', async () => {
      const createDto: CreatePersonDto = {
        firstName: 'Felipe',
        lastName: 'Giovanardi',
        dni: '45405552',
        email: 'felipegiovanardi19@gmail.com',
        cityId: 2,
        birthDate: '19/01/2004',
      };

      const mockPerson: Person = {
        id: 4,
        firstName: createDto.firstName ?? '',
        lastName: createDto.lastName ?? '',
        dni: createDto.dni ?? '',
        email: createDto.email ?? '',
        birthDate: createDto.birthDate ?? '',
        city: { 
          id: 2, 
          name: 'Córdoba', 
          province: { id: 4, name: 'Córdoba', country: { id: 1, name: 'Argentina' } as Country } as Province 
        } as City,
        user: {} as UserEntity,
      };
      (service.remove as jest.Mock<any>).mockResolvedValue(mockPerson);
      const result = await controller.remove(4);
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual(mockPerson);
      console.log('Persona eliminada: ', result);
    });
  });
});