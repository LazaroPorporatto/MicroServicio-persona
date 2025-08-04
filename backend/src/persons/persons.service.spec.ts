import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './persons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Persons } from '../entities/persons.entity';
import { City } from '../entities/city.entity';

// Mocks vacíos para los repositorios
const mockPersonsRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockCityRepo = {
  findOne: jest.fn(),
};

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Persons),
          useValue: mockPersonsRepo,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepo,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
