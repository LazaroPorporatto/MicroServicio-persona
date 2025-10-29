import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Persons } from './persons.entity'; 
export const entities = [Persons]; // exportar un array de clases de entidades

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'users',
      username: 'userexample',
      entities: entities,
      synchronize: true,
      port: 5433,
      host: 'localhost',
    }),
    TypeOrmModule.forFeature(entities), // entidades por cada modulo
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
