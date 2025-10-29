import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/jwt/middleware/guards/auth.guard';
import { PermissionsGuard } from '../src/auth/guards/permissions.guard';

describe('API End-to-End Tests', () => {
  let app: INestApplication;

  const uniqueId = Date.now();
  const newUserCredentials = {
    firstName: 'Lázaro',
    lastName: 'Porporatto',
    dni: `44296918-${uniqueId}`, 
    email: `lazaroporporatto-${uniqueId}@algo.com`,
    birthDate: '2002-08-21',
    cityId: 1, 
    password: 'PasswordSuperSegura123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(PermissionsGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Registration and Authentication Flow', () => {
    beforeAll(() => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send(newUserCredentials)
          .expect(201);
    });

    it('INT-01: (POST /auth/register) Debería fallar al intentar registrar un usuario duplicado', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(newUserCredentials)
            .expect(409);
    });

    it('INT-02: (POST /auth/register) Debería rechazar registro con contraseña corta', () => {
        const userWithShortPass = { ...newUserCredentials, dni: `short-${Date.now()}`, email: `short-${Date.now()}@test.com`, password: '123' };
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(userWithShortPass)
            .expect(400)
            .then(response => {
                expect(response.body.message).toEqual(expect.arrayContaining([
                    'La contraseña debe tener al menos 6 caracteres.'
                ]));
            });
    });
    
    it('INT-03: (POST /auth/login) Debería permitir el login con credenciales correctas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: newUserCredentials.email, password: newUserCredentials.password })
        .expect(201) 
        .then((response) => {
          expect(response.body.accessToken).toBeDefined();
        });
    });

    it('INT-04: (POST /auth/login) Debería rechazar el login con contraseña incorrecta', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: newUserCredentials.email, password: 'contraseña-erronea' })
        .expect(401); 
    });
  });

  describe('2. Protected Routes Access (/persons)', () => {
      it('INT-05: (GET /persons) Debería devolver un objeto de paginación con la lista de personas en la propiedad "content"', () => {
          return request(app.getHttpServer())
            .get('/persons')
            .expect(200)
            .then(response => {
                expect(response.body).toHaveProperty('content');
                expect(Array.isArray(response.body.content)).toBe(true);
            });
      });
  });
});