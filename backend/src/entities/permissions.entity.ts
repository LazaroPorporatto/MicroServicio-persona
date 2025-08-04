import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './roles.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // El nombre del permiso debe ser único
  name: string;

  // description eliminada (puedes descomentar si la necesitas)
  // @Column()
  // description: string;

  // Relación con roles
  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
