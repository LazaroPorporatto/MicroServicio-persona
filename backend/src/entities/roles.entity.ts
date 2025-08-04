// RUTA: src/entities/roles.entity.ts
// --- CÓDIGO FINAL LISTO PARA COPIAR Y PEGAR ---

import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'roles' }) // Es buena práctica nombrar la tabla en plural
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // El código del rol (ej: 'admin') debe ser único
  code: string;

  // --- CAMBIO: Cambiado de 'descripcion' a 'name' para consistencia ---
  @Column()
  name: string; // Nombre legible, ej: "Administrador del Sistema"

  @ManyToMany(
    () => PermissionEntity,
    (permission) => permission.roles, // Cambiado el nombre de la variable para claridad
    { cascade: true } // Cascade ayuda a guardar/actualizar relaciones más fácil
  )
  @JoinTable({
    name: 'roles_permissions', // Nombre explícito para la tabla intermedia
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  // La relación con UserEntity se queda como está
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}