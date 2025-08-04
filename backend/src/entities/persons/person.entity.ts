import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  OneToOne, 
} from 'typeorm';
import { City } from '../city/city.entity';
import { UserEntity } from '../users.entity'; 

@Entity({ name: 'persons' })
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  dni: string;

  @Column({ unique: true, nullable: true })
  email: string;

  // lo manejamos como un string para evitar cualquier conversión de zona horaria. Si no UTC te toma un dia antes.
  @Column({ type: 'date', nullable: true })
  birthDate: string; 

  @ManyToOne(() => City, (city) => city.persons, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToOne(() => UserEntity, (user) => user.person)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}