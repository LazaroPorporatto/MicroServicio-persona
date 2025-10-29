import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceService } from './province.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Province } from './province.entity';
import { Country } from '../country/country.entity'; 
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';

// Datos de prueba simulados 
const mockCountry = { id: 1, name: 'Argentina' } as Country;
const mockProvince = { id: 1, name: 'Corrientes', country: mockCountry } as Province;
const mockProvinces: Province[] = [
  mockProvince,
  { id: 2, name: 'Chaco', country: mockCountry } as Province,
];

//  Mock para ambos Repositorios 
const mockProvinceRepository = {
  find: jest.fn().mockResolvedValue(mockProvinces),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((province) =>
    Promise.resolve({ id: 1, ...province }),
  ),    
  remove: jest.fn().mockResolvedValue(undefined),
};

const mockCountryRepository = {
  findOneBy: jest.fn(),
};

describe('ProvinceService', () => {
  let service: ProvinceService;
  let provinceRepository: Repository<Province>;
  let countryRepository: Repository<Country>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvinceService,
        {
          provide: getRepositoryToken(Province),
          useValue: mockProvinceRepository,
        },
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    service = module.get<ProvinceService>(ProvinceService);
    provinceRepository = module.get<Repository<Province>>(
      getRepositoryToken(Province),
    );
    countryRepository = module.get<Repository<Country>>(
      getRepositoryToken(Country),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  // Pruebas para CREATE

  describe('create', () => {
    const createDto: CreateProvinceDto = {
      name: 'Formosa',
      countryId: 1,
    } as CreateProvinceDto; //

    it('should successfully create a province if country exists', async () => {
      mockCountryRepository.findOneBy.mockResolvedValue(mockCountry); 
      mockProvinceRepository.create.mockReturnValue({
        name: createDto.name,
        country: mockCountry,
      });
      mockProvinceRepository.save.mockResolvedValue({
        id: 3,
        name: createDto.name,
        country: mockCountry,
      });

      const result = await service.create(createDto);

      expect(countryRepository.findOneBy).toHaveBeenCalledWith({
        id: createDto.countryId,
      });
      expect(provinceRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 3);
    });

    it('should throw NotFoundException if country does not exist', async () => {
      mockCountryRepository.findOneBy.mockResolvedValue(null); 

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });


  // Pruebas para FIND ALL y FIND ONE
 
  describe('findAll', () => {
    it('should return an array of provinces', async () => {
      const result = await service.findAll();
      
      expect(result).toEqual(mockProvinces);
    });
  });

  describe('findOne', () => {
    it('should return a single province', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(mockProvince);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProvince);
    });

    it('should throw NotFoundException if province not found', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
  
 
  // Pruebas para UPDATE (PATCH)
  
  describe('update', () => {
    const updateDto: UpdateProvinceDto = { name: 'Corrientes Capital' };
    const updateDtoWithCountry: UpdateProvinceDto = { countryId: 2 };
    const newCountry = { id: 2, name: 'Brasil' } as Country;

    it('should update name and return the updated province', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(mockProvince);
      
      const expectedResult = { ...mockProvince, name: updateDto.name };
      mockProvinceRepository.save.mockResolvedValue(expectedResult);

      const result = await service.update(1, updateDto);

      expect(provinceRepository.save).toHaveBeenCalledWith(expectedResult);
      expect(result.name).toBe(updateDto.name);
    });
    
    it('should update country if countryId is provided', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(mockProvince);
      mockCountryRepository.findOneBy.mockResolvedValue(newCountry);

      const expectedResult = { ...mockProvince, country: newCountry };
      mockProvinceRepository.save.mockResolvedValue(expectedResult);

      const result = await service.update(1, updateDtoWithCountry);

      expect(countryRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(result.country.id).toBe(2);
    });

    it('should throw NotFoundException if province not found', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(null);

      await expect(service.update(99, updateDto)).rejects.toThrow(NotFoundException);
    });
  });


  // Pruebas para REMOVE

  describe('remove', () => {
    it('should successfully remove a province', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(mockProvince);

      await service.remove(1);

      expect(provinceRepository.remove).toHaveBeenCalledWith(mockProvince);
    });

    it('should throw NotFoundException if province not found', async () => {
      mockProvinceRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(provinceRepository.remove).not.toHaveBeenCalled();
    });
  });

  // Pruebas para REPLACE (PUT)
  
  describe('replace', () => {
    const replaceDto: CreateProvinceDto = { name: 'Chaco Nuevo', countryId: 1 } as CreateProvinceDto;

    it('should completely replace a province and return the updated entity', async () => {
        mockProvinceRepository.findOne.mockResolvedValue(mockProvince);
        mockCountryRepository.findOneBy.mockResolvedValue(mockCountry);

        const expectedResult = { ...mockProvince, name: replaceDto.name, country: mockCountry };
        mockProvinceRepository.save.mockResolvedValue(expectedResult);

        const result = await service.replace(1, replaceDto);

        expect(provinceRepository.save).toHaveBeenCalledWith(expectedResult);
        expect(result.name).toBe('Chaco Nuevo');
    });

    it('should throw NotFoundException if province not found', async () => {
        mockProvinceRepository.findOne.mockResolvedValue(null);
        await expect(service.replace(99, replaceDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if new country not found', async () => {
        mockProvinceRepository.findOne.mockResolvedValue(mockProvince);
        mockCountryRepository.findOneBy.mockResolvedValue(null); 

        await expect(service.replace(1, replaceDto)).rejects.toThrow(NotFoundException);
    });
  });
});