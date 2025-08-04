import { Body, Controller, Get, Patch, Post, Put, Delete, Param } from '@nestjs/common';
import { CreateCountry } from './createCountry';
import { CountryService } from './country.service';
import { UpdateCountry } from './updateCountry';

@Controller('country')
export class CountryController {

    constructor(private readonly countryService: CountryService) { }


    @Get()
    async getAll() {
        return await this.countryService.getAll();

    }
    @Get(':id')
    async getid(@Param('id') id: number) {
        return await this.countryService.findOne(id);
    }

    @Post()
    async post(@Body() createCountry: CreateCountry) {
        return await this.countryService.create(createCountry);
    }
    @Put(':id')
    async put(@Param('id') id: number, @Body() updateCountry: UpdateCountry) {
        return await this.countryService.update(id, updateCountry);
    }
    @Patch(':id')
    async patch(@Param('id') id: number, @Body() updateCountry: UpdateCountry) {
        return await this.countryService.partialUpdate(id, updateCountry);
    }
    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.countryService.delete(id);
        return { message: `Country id: ${id} deleted` };
    }
}