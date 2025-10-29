import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from 'src/jwt/middleware/guards/auth.guard';
import { Request } from 'express';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return this.usersService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto) { 
    return this.usersService.createUser(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-permissions')
  getPermissions(@Req() req: Request) {
    return (req.user as any)?.permissions || [];
  }
}