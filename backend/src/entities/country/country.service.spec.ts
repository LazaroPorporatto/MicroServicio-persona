import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from './country.entity';

// --- Interfaces de Reemplazo (Input y Relación) ---
interface CountryInput {
  name: string;
}
interface ProvinceStub {
    id: number;
    name: string;
}

// Definición del Mock/Stub del Repositorio de TypeORM ---
const mockCountryRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

//Datos de Prueba con la Relación 'provinces'
const mockProvince1: ProvinceStub = { id: 101, name: 'Buenos Aires' };
const mockProvince2: ProvinceStub = { id: 102, name: 'Córdoba' }; 

const mockCountry: Country = { 
  id: 1, 
  name: 'Argentina', 
  provinces: [mockProvince1 as any, mockProvince2 as any] // El Mock incluye la relación
} as Country; 

const anotherMockCountry: Country = { 
  id: 2, 
  name: 'Chile', 
  provinces: [] 
} as Country; 

const createCountryInput: CountryInput = { name: 'Argentina' };
const updateCountryInput: CountryInput = { name: 'Argentina Nuevo' };


describe('CountryService (Prueba de Integración con Mock Repository)', () => {
  let service: CountryService;
  let repository: Repository<Country>;

  beforeEach(async () => {
    jest.clearAllMocks(); 
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<Repository<Country>>(getRepositoryToken(Country));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

// -------------------------------------------------------------------

  describe('create', () => {
    it('debe crear y retornar un país, verificando que incluya la relación', async () => {
      // Mockea la creación de la entidad (con su relación)
      (repository.create as jest.Mock).mockReturnValue(mockCountry);
      (repository.save as jest.Mock).mockResolvedValue(mockCountry);

      const result = await service.create(createCountryInput as any);
      
      expect(repository.create).toHaveBeenCalledWith(createCountryInput);
      expect(repository.save).toHaveBeenCalledWith(mockCountry);
      
      // La aserción verifica que el objeto retornado tiene la relación 'provinces', porque en la entity tenemos una relacion directa. 
      expect(result).toEqual(mockCountry);
      expect(result.provinces.length).toBe(2);
    });
  });

// -------------------------------------------------------------------

  describe('findAll', () => {
    it('debe retornar un array de países, incluyendo sus relaciones', async () => {
      const countryList = [mockCountry, anotherMockCountry];
      (repository.find as jest.Mock).mockResolvedValue(countryList);

      const result = await service.findAll();
      
      expect(repository.find).toHaveBeenCalled();
      
      // La aserción verifica que la lista retornada incluye los objetos con sus relaciones
      expect(result).toEqual(countryList);
      expect(result.length).toBe(2);
      expect(result[0].provinces).toBeDefined();
    });
  });

// -------------------------------------------------------------------

  describe('findOne', () => {
    const id = 1;

    it('debe retornar el país si se encuentra', async () => {
      // Éxito: Mock devuelve la entidad con la relación
      (repository.findOneBy as jest.Mock).mockResolvedValue(mockCountry);

      const result = await service.findOne(id);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(mockCountry);
      expect(result.provinces).toBeDefined();
    });

    it('debe lanzar NotFoundException si no se encuentra', async () => {
      // Error: Mock devuelve undefined
      (repository.findOneBy as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

// -------------------------------------------------------------------

  describe('update', () => {
    const id = 1;
    // Creamos una entidad mockeada actualizada
    const updatedCountry = { id: 1, ...updateCountryInput, provinces: mockCountry.provinces } as Country;

    it('debe actualizar y retornar el país si se encuentra', async () => {
      // preload simula la carga y fusión de datos
      (repository.preload as jest.Mock).mockResolvedValue(updatedCountry);
      (repository.save as jest.Mock).mockResolvedValue(updatedCountry);

      const result = await service.update(id, updateCountryInput as any);
      
      expect(repository.preload).toHaveBeenCalledWith({ id, ...updateCountryInput });
      expect(repository.save).toHaveBeenCalledWith(updatedCountry);
      
      expect(result).toEqual(updatedCountry);
    });

    it('debe lanzar NotFoundException si no se encuentra', async () => {
      (repository.preload as jest.Mock).mockResolvedValue(undefined);
      await expect(service.update(id, updateCountryInput as any)).rejects.toThrow(NotFoundException);
    });
  });

// -------------------------------------------------------------------

  describe('replace', () => {
    const id = 1;
    const newCountryInput: CountryInput = { name: 'País Reemplazado' };
    
    // Entidad de retorno esperada con el nuevo nombre y la relación
    const replacedCountry = { id: 1, name: 'País Reemplazado', provinces: mockCountry.provinces } as Country;
    
    // Entidad original (la que encuentra findOne)
    const originalCountry = { id: 1, name: 'Viejo Nombre', provinces: mockCountry.provinces } as Country;

    it('debe reemplazar el nombre del país si se encuentra', async () => {
      //  findOne (internamente) llama a findOneBy
      (repository.findOneBy as jest.Mock).mockResolvedValue(originalCountry);
      // save
      (repository.save as jest.Mock).mockResolvedValue(replacedCountry);

      const result = await service.replace(id, newCountryInput as any);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      // Se espera que save sea llamado con el objeto que tiene el nuevo nombre y la relación intacta
      expect(repository.save).toHaveBeenCalledWith(replacedCountry);

      expect(result).toEqual(replacedCountry);
      expect(result.name).toBe(newCountryInput.name);
    });
  });

// -------------------------------------------------------------------

  describe('remove', () => {
    const id = 1;

    it('debe eliminar el país si se encuentra', async () => {
      // findOne (internamente) devuelve la entidad completa
      (repository.findOneBy as jest.Mock).mockResolvedValue(mockCountry);
      //  remove
      (repository.remove as jest.Mock).mockResolvedValue(undefined);

      await service.remove(id);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      // El servicio debe llamar a remove con la entidad que encontró
      expect(repository.remove).toHaveBeenCalledWith(mockCountry);
      expect(repository.remove).toHaveBeenCalledTimes(1);
    });
  });

});