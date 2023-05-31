import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token =
        req.headers.authorization?.split(' ')[1] ||
        req.query.token ||
        req.cookies.token;

      const decodedToken = await this.authService.validateUser(token);

      req['user'] = decodedToken;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
