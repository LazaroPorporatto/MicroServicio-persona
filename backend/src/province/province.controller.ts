import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProvinceService } from './province.service'; 
import { CreateProvinceDto } from './create-province.dto';
import { UpdateProvinceDto } from './update-province.dto';
import { Province } from '../entities/province.entity';

@Controller('province') // Prefijo de la ruta: todas las rutas aquí empiezan con /province
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  // POST /province
  @Post()
  create(@Body() createProvinceDto: CreateProvinceDto): Promise<Province> {
    return this.provinceService.create(createProvinceDto);
  }

  // GET /province
  @Get()
  findAll(): Promise<Province[]> {
    return this.provinceService.findAll();
  }

  // GET /province/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Province> {
    return this.provinceService.findOne(id);
  }

  // PUT /province/:id
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    return this.provinceService.update(+id, updateProvinceDto);
  }

  // PATCH /province/:id
  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    return this.provinceService.patch(+id, updateProvinceDto);
  }

  // DELETE /province/:id (Opcional, pero se recomienda implementarlo para un CRUD completo)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string): Promise<{ message: string }> {
    return this.provinceService.remove(+id);
  }
}
