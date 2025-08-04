// RUTA: backend/src/database/seeder.service.ts
// --- CÓDIGO FINAL CORREGIDO, LISTO PARA COPIAR Y PEGAR ---

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permissions.entity';
import { RoleEntity } from '../entities/roles.entity';
import { UserEntity } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    await this.seedPermissionsAndRoles();
    await this.fixAdminUser();
    this.logger.log('Proceso de inicialización finalizado.');
  }

  // --- MÉTODO CORREGIDO Y MEJORADO ---
  async fixAdminUser() {
    const adminEmail = 'lazaroporporatto@yahoo.com';
    const adminPassword = 'EnzoPerez24';

    this.logger.log(`Verificando y configurando usuario administrador: ${adminEmail}`);

    // 1. Buscamos el rol 'ADMIN'. Es crucial que exista.
    const adminRole = await this.roleRepository.findOne({ where: { code: 'ADMIN' } });
    if (!adminRole) {
      this.logger.error('Rol "ADMIN" no encontrado. No se pudo configurar el usuario administrador. Ejecuta el seeder de roles primero.');
      return;
    }

    // 2. Buscamos al usuario admin, cargando también sus roles actuales.
    let adminUser = await this.userRepository.findOne({ 
      where: { email: adminEmail },
      relations: ['roles'] // <-- ¡MUY IMPORTANTE! Cargar la relación de roles.
    });

    // 3. Si el usuario no existe, lo creamos.
    if (!adminUser) {
      this.logger.log(`Usuario admin no encontrado, creando uno nuevo...`);
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        roles: [adminRole] // Le asignamos el rol de admin desde su creación.
      });
    } else {
      // 4. Si el usuario ya existe, nos aseguramos de que tenga el rol de admin.
      this.logger.log(`Usuario admin encontrado. Verificando rol...`);
      
      const hasAdminRole = adminUser.roles.some(role => role.code === 'ADMIN');
      
      if (!hasAdminRole) {
        this.logger.log(`El usuario no tiene el rol de ADMIN. Asignándolo ahora...`);
        adminUser.roles.push(adminRole);
      } else {
        this.logger.log(`El usuario ya tiene el rol de ADMIN.`);
      }
      
      // Opcional: También puedes verificar y resetear la contraseña si quieres
      const isPasswordCorrect = await bcrypt.compare(adminPassword, adminUser.password ?? '');
      if (!isPasswordCorrect) {
        this.logger.log('La contraseña del admin es incorrecta. Actualizando...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        adminUser.password = hashedPassword;
      }
    }

    // 5. Guardamos todos los cambios en el usuario (sea nuevo o actualizado).
    await this.userRepository.save(adminUser);
    this.logger.log(`Usuario ${adminEmail} configurado correctamente como ADMIN.`);
  }

  // Tu método seedPermissionsAndRoles se queda igual, está correcto.
  async seedPermissionsAndRoles() {
    this.logger.log('Iniciando el seeder de permisos y roles...');
    
    const requiredPermissions = [
      { name: 'leer_personas', description: 'Permite ver la lista de personas/clientes' },
      { name: 'editar_personas', description: 'Permite editar una persona/cliente' },
      { name: 'eliminar_personas', description: 'Permite eliminar una persona/cliente' },
    ];
    
    const permissionEntities: PermissionEntity[] = [];
    for (const p of requiredPermissions) {
      let perm = await this.permissionRepository.findOne({ where: { name: p.name } });
      if (!perm) {
        perm = this.permissionRepository.create(p);
        await this.permissionRepository.save(perm);
      }
      permissionEntities.push(perm);
    }
    this.logger.log('Permisos verificados/creados.');

    const userRole = await this.findOrCreateRole('USUARIO', 'Usuario Estándar');
    const adminRole = await this.findOrCreateRole('ADMIN', 'Administrador del Sistema');
    
    userRole.permissions = permissionEntities.filter(p => p.name === 'leer_personas');
    adminRole.permissions = permissionEntities; // Admin tiene todos los permisos
    
    await this.roleRepository.save([userRole, adminRole]);
    this.logger.log('Roles y asignación de permisos verificados/creados.');
  }

  private async findOrCreateRole(code: string, name: string): Promise<RoleEntity> {
    let role = await this.roleRepository.findOne({ where: { code }, relations: ['permissions'] });
    if (!role) {
      this.logger.log(`Creando nuevo rol: ${name} (${code})`);
      role = this.roleRepository.create({ code, name });
      await this.roleRepository.save(role);
    }
    return role;
  }
}