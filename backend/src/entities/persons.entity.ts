import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('persons')
export class Persons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column()
  province: string;

  @ManyToOne(() => City, (city) => city.persons)
  @JoinColumn({ name: 'cityId' })
  city: City;
}
