import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(token: string) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      email: string;
      id: string;
    };

    const user = this.usersService.findByEmail(decodedToken.email);
    return decodedToken;
  }

  async login(user: {
    email: string;
    id: string;
    firstname: string;
    lastname: string;
  }) {
    const payload = {
      email: user.email,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
