import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// Asegúrate de que el archivo entities.ts existe en la misma carpeta o ajusta la ruta de importación
import { Persons } from './persons.entity'; // Ajusta el nombre y la ruta de tus entidades reales
// Agrega aquí todas tus entidades, por ejemplo:
export const entities = [Persons]; // Asegúrate de exportar un array de clases de entidades

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
