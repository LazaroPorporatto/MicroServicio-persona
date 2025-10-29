import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { PermissionEntity } from 'src/entities/permissions.entity';
import { RoleEntity } from 'src/entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createRole(role: DeepPartial<RoleEntity>): Promise<RoleEntity> {
    try {
      const newRole = this.roleRepository.create(role);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      console.error('Error al crear el rol:', error);
      throw new BadRequestException('Error al crear el rol. Verifique los datos.');
    }
  }

  async getRoles(): Promise<RoleEntity[]> {
    try {
      return await this.roleRepository.find({ relations: ['permissions'] });
    } catch (error) {
      console.error('Error al listar los roles:', error);
      throw new InternalServerErrorException('Error al listar los roles.');
    }
  }

  async findOneRole(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado.`);
    }
    return role;
  }

  async actualizarRole(
    param: { id: number },
    roleDto: DeepPartial<RoleEntity>,
  ): Promise<RoleEntity> {
    const roleAActualizar = await this.roleRepository.findOneBy({ id: param.id });

    if (!roleAActualizar) {
      throw new NotFoundException('No se encontró ningún rol con el ID ingresado');
    }

    if (roleDto.code !== undefined) {
      roleAActualizar.code = roleDto.code;
    }
    if (roleDto.name !== undefined) {
      roleAActualizar.name = roleDto.name;
    }

    await this.roleRepository.save(roleAActualizar);
    return await this.findOneRole(param.id);
  }

  async deleteRole(id: number): Promise<{ message: string }> {
    const roleAEliminar = await this.roleRepository.findOneBy({ id: id });

    if (!roleAEliminar) {
      throw new NotFoundException(`No se encontró ningún rol con el ID ${id} para eliminar.`);
    }

    await this.roleRepository.delete({ id: id });
    return { message: 'deleted' };
  }

  async asignarPermissionARol(
    param: { id: number },
    permission_body: DeepPartial<PermissionEntity>,
  ): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { id: param.id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Rol con ID ingresado no encontrado');
    }

    const permission = await this.permissionRepository.findOneBy({ id: permission_body.id });
    if (!permission) {
      throw new NotFoundException('Permiso con ID ingresado no encontrado');
    }
    if (role.permissions.find((p) => p.id === permission.id)) {
      throw new BadRequestException('El permiso ya está asignado al rol');
    }

    role.permissions.push(permission);
    return await this.roleRepository.save(role);
  }
}