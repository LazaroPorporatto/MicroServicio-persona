import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, QueryFailedError, DataSource } from 'typeorm';

// Entidades que vamos a gestionar
import { UserEntity } from 'src/entities/users.entity';
import { RoleEntity } from 'src/entities/roles.entity';
import { Person } from 'src/entities/persons/person.entity';
import { City } from 'src/entities/city/city.entity';

// DTOs específicos para cada acción
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async login(body: LoginAuthDto) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !user.password || !compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const permissions = user.roles.flatMap(role =>
      role.permissions.map(permission => permission.name)
    );
    const uniquePermissions = [...new Set(permissions)];
    const payload = {
      sub: user.id,
      email: user.email,
      permissions: uniquePermissions,
    };

    return {
      message: 'Login exitoso',
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Método para registrar un nuevo usuario 
  async createUser(body: RegisterAuthDto): Promise<{ status: string }> { 
    const { email, password, firstName, lastName, dni, birthDate, cityId } = body;
    // Usamos una transacción para asegurar la integridad de los datos.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verifica si la ciudad existe
      const city = await this.cityRepository.findOneBy({ id: cityId });
      if (!city) {
        throw new NotFoundException(`La ciudad con ID "${cityId}" no fue encontrada.`);
      }

      // Crea la entidad de Usuario
      const defaultRole = await this.roleRepository.findOneBy({ code: 'user' });
      if (!defaultRole) {
        throw new InternalServerErrorException('El rol por defecto "user" no se encuentra.');
      }
      
      const newUserEntity = this.userRepository.create({
        email,
        password: hashSync(password, 10),
        roles: [defaultRole],
      });
      const savedUser = await queryRunner.manager.save(newUserEntity);

      // Crea la entidad de Persona y la asocia al usuario recién creado
      const newPersonEntity = this.personRepository.create({
        firstName,
        lastName,
        dni,
        email, // Guardamos el email también en el perfil
        
        birthDate: birthDate,
        
        city, // Pasamos la entidad de ciudad completa
        user: savedUser, // Asociamos la persona al usuario
      });
      await queryRunner.manager.save(Person, newPersonEntity);

      // Si todo fue bien, confirmamos la transacción
      await queryRunner.commitTransaction();
      
      return { status: 'created' };

    } catch (error) {
      // Si algo falla, revertimos todos los cambios
      await queryRunner.rollbackTransaction();
      
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        // '23505' es el código de PostgreSQL para violación de unicidad
        throw new ConflictException('El email o DNI ya están en uso.');
      }
      if (error instanceof HttpException) {
        throw error; // Re-lanza excepciones conocidas de NestJS (como NotFoundException)
      }
      // Para cualquier otro error inesperado
      throw new InternalServerErrorException('Ocurrió un error inesperado al crear el usuario.');
    } finally {
      // Siempre liberamos el queryRunner para evitar fugas de memoria
      await queryRunner.release();
    }
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
  
  async asignarRoleAUser(param: { id: number }, role_body: DeepPartial<RoleEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: param.id }, relations: ['roles'] });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    const role = await this.roleRepository.findOneBy({ id: role_body.id });
    if (!role) throw new NotFoundException('Rol no encontrado.');
    if (user.roles.some(r => r.id === role.id)) {
      throw new BadRequestException('El rol ya está asignado al usuario.');
    }
    user.roles.push(role);
    return this.userRepository.save(user);
  }
}