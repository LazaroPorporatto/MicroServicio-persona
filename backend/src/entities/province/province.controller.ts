// src/province/province.controller.ts

// 1. ASEGÚRATE de que 'Patch' está importado aquí arriba
import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Put, Delete, HttpCode } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';

// 2. USAREMOS LA RUTA EN SINGULAR para que coincida con tus pruebas
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  create(@Body() dto: CreateProvinceDto) {
    return this.provinceService.create(dto);
  }

  @Get()
  findAll() {
    return this.provinceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.provinceService.findOne(id);
  }

  // --- ESTA ES LA RUTA QUE FALTA ---
  // 3. ASEGÚRATE de que este bloque de código completo exista
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProvinceDto,
  ) {
    return this.provinceService.update(id, updateDto);
  }
  // --- FIN DEL BLOQUE IMPORTANTE ---

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDto: CreateProvinceDto,
  ) {
    return this.provinceService.replace(id, createDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.provinceService.remove(id);
  }
}