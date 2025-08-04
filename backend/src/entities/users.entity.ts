// RUTA: src/entities/users.entity.ts
// --- CÓDIGO CORREGIDO, LISTO PARA COPIAR Y PEGAR ---

import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from './persons/person.entity';
import { RoleEntity } from './roles.entity';
// No necesitamos PermissionEntity aquí

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @OneToOne(() => Person, (person) => person.user, { cascade: true })
  person: Person;

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true, eager: true })
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];

  // --- CAMBIO: ELIMINADA LA RELACIÓN DIRECTA CON PERMISOS ---
  // Esta relación ya no existe, ya que los permisos se obtienen a través de los roles.
  // @ManyToMany(
  //   () => PermissionEntity,
  //   (permission) => permission.users, // Esto causaba el error
  // )
  // @JoinTable({
  //   name: 'users_permissions',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  // })
  // permissions: PermissionEntity[];
}