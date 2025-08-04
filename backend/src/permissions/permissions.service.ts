// RUTA: src/permissions/permissions.service.ts
// --- CÓDIGO FINAL LISTO PARA COPIAR Y PEGAR ---

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { PermissionEntity } from 'src/entities/permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createPermission(
    permissionDto: DeepPartial<PermissionEntity>,
  ): Promise<PermissionEntity> {
    try {
      const newPermission = this.permissionRepository.create(permissionDto);
      return await this.permissionRepository.save(newPermission);
    } catch (error: any) {
      console.error('Error al crear el permiso:', error);
      throw new BadRequestException('Error al crear el permiso. Verifique los datos.');
    }
  }

  async getPermissions(): Promise<PermissionEntity[]> {
    try {
      return await this.permissionRepository.find();
    } catch (error) {
      console.error('Error al listar permisos:', error);
      throw new InternalServerErrorException('Error al listar los permisos.');
    }
  }

  async findOnePermission(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado.`);
    }
    return permission;
  }

  async actualizarPermission(
    param: { id: number },
    permissionDto: DeepPartial<PermissionEntity>,
  ): Promise<PermissionEntity> {
    const permissionAActualizar = await this.permissionRepository.findOneBy({ id: param.id });

    if (!permissionAActualizar) {
      throw new NotFoundException('No se encontró ningún permiso con el ID ingresado');
    }

    // --- CAMBIO: Eliminada la lógica que usaba 'description' ---
    if (permissionDto.name !== undefined) {
      permissionAActualizar.name = permissionDto.name;
    }

    await this.permissionRepository.save(permissionAActualizar);
    return await this.findOnePermission(param.id);
  }

  async deletePermission(id: number): Promise<{ message: string }> {
    const permissionAEliminar = await this.permissionRepository.findOneBy({ id });

    if (!permissionAEliminar) {
      throw new NotFoundException(`No se encontró ningún permiso con el ID ${id} para eliminar.`);
    }

    await this.permissionRepository.delete({ id });
    return { message: 'deleted' };
  }
}