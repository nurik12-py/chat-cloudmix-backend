import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, id: user._id };

    const token = await this.authService.login(payload);

    return token;
  }

  @Post('register')
  async register(
    @Body()
    body: {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    },
  ) {
    const { firstname, lastname, email, password } = body;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const newUser = await this.usersService.createUser({
      firstname,
      lastname,
      email,
      password,
    });

    const payload = { email: newUser.email, id: newUser._id };
    const token = this.authService.login(payload);

    return token;
  }
}
