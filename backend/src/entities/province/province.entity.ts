import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany, 
} from 'typeorm';
import { Country } from '../country/country.entity';
import { City } from '../city/city.entity'; 

@Entity({ name: 'provinces' })
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  // RELACIÓN HACIA ARRIBA: Muchas provincias pertenecen a UN país ---
  @ManyToOne(() => Country, (country) => country.provinces, { 
    eager: true, // Carga el país automáticamente.
    nullable: false 
  })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  // RELACIÓN HACIA ABAJO: Una provincia tiene MUCHAS ciudades ---
  @OneToMany(() => City, (city) => city.province)
  cities: City[];
}