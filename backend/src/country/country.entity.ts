import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('country')
export class Country extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}