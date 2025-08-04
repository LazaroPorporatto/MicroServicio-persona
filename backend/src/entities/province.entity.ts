import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity('province')
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relación con país
  @ManyToOne(() => Country, (country) => country.provinces)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @Column()
  countryId: number;

  // Relación con ciudades
  @OneToMany(() => City, (city) => city.province)
  cities: City[];;
}
