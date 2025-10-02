import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonsService } from './persons.service';
import { Person } from './person.entity';
import { City } from '../city/city.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePersonDto } from './dto/createPerson.dto';

// Mocks de los repositorios
const mockPersonRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockCityRepository = {
  findOneBy: jest.fn(),
};

describe('PersonsService', () => {
  let service: PersonsService;
  let personRepository: Repository<Person>;
  let cityRepository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockPersonRepository,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
      ],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
    personRepository = module.get<Repository<Person>>(getRepositoryToken(Person));
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));

    // Reinicia los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  // --- Pruebas para el método GET (findAll) ---
  describe('findAll', () => {
    it('debería devolver una lista de personas', async () => {
      // Prepara la lista que el mock del repositorio debe devolver
      const mockPeople = [{ id: 1, firstName: 'John' }, { id: 2, firstName: 'Jane' }];
      mockPersonRepository.find.mockResolvedValue(mockPeople);

      const paginationDto = { page: 1, itemsPerPage: 5 }; // Ajusta los valores según lo que esperes
      const result = await service.findAll(paginationDto);

      expect(result).toEqual(mockPeople);
      expect(mockPersonRepository.find).toHaveBeenCalled();
    });
  });

  // --- Pruebas para el método GET (findOne) ---
  describe('findOne', () => {
    it('debería devolver una persona si existe', async () => {
      const mockPerson = { id: 1, firstName: 'John' };
      mockPersonRepository.findOne.mockResolvedValue(mockPerson);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPerson);
      expect(mockPersonRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['city', 'city.province', 'city.province.country'],
      });
    });

    it('debería lanzar NotFoundException si la persona no existe', async () => {
      mockPersonRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- Pruebas para el método POST (create) ---
  describe('create', () => {
    const createPersonDto: CreatePersonDto = {
      firstName: 'carolina',
      lastName: 'Rubio',
      dni: '12345678',
      cityId: 1,
      email: 'messi@example.com',
      birthDate: new Date().toISOString(),
    };
    const mockCity = { id: 1, name: 'Rosario' };

    it('debería crear y devolver una nueva persona si la ciudad existe', async () => {
      // Mockea el comportamiento de los repositorios
      mockCityRepository.findOneBy.mockResolvedValue(mockCity);
      mockPersonRepository.create.mockReturnValue({ ...createPersonDto, city: mockCity });
      mockPersonRepository.save.mockResolvedValue({ id: 1, ...createPersonDto, city: mockCity });

      const result = await service.create(createPersonDto);

      expect(result).toEqual({ id: 1, ...createPersonDto, city: mockCity });
      expect(mockCityRepository.findOneBy).toHaveBeenCalledWith({ id: createPersonDto.cityId });
      expect(mockPersonRepository.create).toHaveBeenCalledWith({
        firstName: createPersonDto.firstName,
        lastName: createPersonDto.lastName,
        dni: createPersonDto.dni,
        email: createPersonDto.email,
        birthDate: createPersonDto.birthDate,
        city: mockCity,
      });
      expect(mockPersonRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si la ciudad no existe', async () => {
      mockCityRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createPersonDto)).rejects.toThrow(NotFoundException);
      expect(mockCityRepository.findOneBy).toHaveBeenCalledWith({ id: createPersonDto.cityId });
      expect(mockPersonRepository.save).not.toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el DNI o Email ya existen', async () => {
      mockCityRepository.findOneBy.mockResolvedValue(mockCity);
      
      // Simula el error de PostgreSQL por duplicación
      const conflictError = { code: '23505' };
      mockPersonRepository.save.mockRejectedValue(conflictError);

      await expect(service.create(createPersonDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createPersonDto)).rejects.toThrow('Ya existe una persona con ese DNI o Email');
    });
  });
});