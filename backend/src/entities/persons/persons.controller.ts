// RUTA: src/entities/persons/persons.controller.ts
// --- CÓDIGO FINAL CORREGIDO ---

import { Controller, Get, Post, Body, Patch, Put, Param, ParseIntPipe, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import { Person } from './person.entity';

import { JwtAuthGuard } from 'src/jwt/middleware/guards/auth.guard'; // Ajusta la ruta si es necesario
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'; // Ajusta la ruta si es necesario
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('persons')
@UseGuards(JwtAuthGuard, PermissionsGuard) // Aplica ambos guards a todo el controlador
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  @Permissions('leer_personas') // plural
  findAll(): Promise<Person[]> {
    return this.personsService.findAll();
  }

  @Get(':id')
  @Permissions('leer_personas') // plural
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personsService.findOne(id);
  }

  // Si no tienes un permiso 'crear_personas', puedes quitar @Permissions o crearlo en el Seeder
  // @Post()
  // @Permissions('crear_personas') 
  // create(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
  //   return this.personsService.create(createPersonDto);
  // }
  
  @Patch(':id')
  @Permissions('editar_personas') // <-- ¡CORREGIDO A PLURAL!
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    return this.personsService.update(id, updatePersonDto);
  }

  @Put(':id')
  @Permissions('editar_personas') // <-- ¡CORREGIDO A PLURAL!
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPersonDto: CreatePersonDto,
  ): Promise<Person> {
    return this.personsService.replace(id, createPersonDto);
  }

  @Delete(':id')
  @Permissions('eliminar_personas') // <-- ¡CORREGIDO A PLURAL!
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.personsService.remove(id);
  }
}