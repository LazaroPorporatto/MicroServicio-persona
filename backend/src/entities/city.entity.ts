import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { Persons } from './persons.entity';

@Entity('city')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Province, (provincia) => provincia.cities)
  @JoinColumn({ name: 'provinceId' })
  province: Province;
  @Column()
  provinceId: number; // La columna de la clave foránea
  @OneToMany(() => Persons, (person) => person.city)
  persons: Persons[];
}
