import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Province } from '../province/province.entity';
import { Person } from '../persons/person.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToOne(() => Province, (province) => province.cities, { eager: true })
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @OneToMany(() => Person, (person) => person.city)
  persons: Person[];
}