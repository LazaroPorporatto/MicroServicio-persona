import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Province } from '../province/province.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  // Un país tiene MUCHAS provincias (relacion hacia abajo)
  @OneToMany(() => Province, (province) => province.country)
  provinces: Province[];
}