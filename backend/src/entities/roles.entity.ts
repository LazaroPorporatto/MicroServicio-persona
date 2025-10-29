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

@Entity({ name: 'roles' }) 
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // El código del rol (ej: 'admin') debe ser único
  code: string;

  @Column()
  name: string; 

  @ManyToMany(
    () => PermissionEntity,
    (permission) => permission.roles,
    { cascade: true } // Cascade ayuda a guardar/actualizar relaciones más fácil
  )
  @JoinTable({
    name: 'roles_permissions', // Nombre explícito para la tabla intermedia
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}