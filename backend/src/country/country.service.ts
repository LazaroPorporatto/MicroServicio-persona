import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCountry } from './updateCountry';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { CreateCountryDto } from 'src/entities/country/dto/create-country.dto';

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
    ) { }
    //GET
    async getAll(): Promise<Country[]> {
        return await this.countryRepository.find();
    }

    // GET /countries/:id
    async findOne(id: number): Promise<Country> {
        //buscar por ID.
        const country = await this.countryRepository.findOneBy({ id });
        // Manejamos el país.
        if (!country) {
            throw new NotFoundException(`Country with ID ${id} not found`);
        }
        return country;
    }

    // POST /countries
    async create(createCountry: CreateCountryDto): Promise<Country> {
        const newCountry = this.countryRepository.create(createCountry);
            return await this.countryRepository.save(newCountry);
    }

    // PUT /countries/:id
    async update(id: number, updateCountry: { name: string }): Promise<Country> {
        // Busca el país por ID.
        const countryToUpdate = await this.countryRepository.findOneBy({ id });
        if (!countryToUpdate) {
            throw new NotFoundException(`Country with ID ${id} not found`);
        }
        countryToUpdate.name = updateCountry.name;

        // Guardamos los cambios en la base de datos.
        return await this.countryRepository.save(countryToUpdate);
    }

    // PATCH /countries/:id
    async partialUpdate(id: number, updateCountry: { name?: string }): Promise<Country> {
        // Actualiza directamente por ID.
        const result = await this.countryRepository.update(id, updateCountry);

        if (result.affected === 0) {
            // Si no se afectó ninguna fila, significa que el país no se encontro.
            throw new NotFoundException(`Country with ID ${id} not found for partial update`);
        }

        // Recupera y retorna el objeto actualizado para confirmación.
        const updatedCountry = await this.countryRepository.findOneBy({ id });
        if (!updatedCountry) {
            // Este caso es poco probable.
            throw new NotFoundException(`Country with ID ${id} not found after partial update`);
        }
        return updatedCountry;
    }

    // DELETE /countries/:id
    async delete(id: number): Promise<{ message: string }> {
        const result = await this.countryRepository.delete(id);
        if (result.affected === 0) {
            // Si no se afecto ninguna fila, significa que el país no existe.
            throw new NotFoundException(`Country with ID ${id} not found for deletion`);
        }
        return { message: `Country id: ${id} deleted successfully` };
    }
}