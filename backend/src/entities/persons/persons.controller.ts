import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, HttpCode, UseGuards, Query } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/createPerson.dto'; 
import { UpdatePersonDto } from './dto/updatePerson.dto'; 
import { Person } from './person.entity';
import { JwtAuthGuard } from '../../jwt/middleware/guards/auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PaginationDto } from './dto/pagination.dto'; 

@Controller('persons')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @Permissions('crear_personas')
  create(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    return this.personsService.create(createPersonDto);
  }
  
  @Get()
  @Permissions('leer_personas')
  findAll(@Query() paginationDto: PaginationDto): Promise<any> {
    return this.personsService.findAll(paginationDto);
  }

  @Get(':id')
  @Permissions('leer_personas')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('editar_personas')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
      return this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @Permissions('eliminar_personas')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.personsService.remove(id);
  }
}