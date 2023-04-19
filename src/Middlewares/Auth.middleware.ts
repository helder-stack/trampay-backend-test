import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {verify} from 'jsonwebtoken'
import JWTResponse from './models/JWTResponse';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const user = await this.validateJWTToken(authorization)
    if(user){
      req['userId'] = user.id
      next()
      return;   
    }
    throw new HttpException("Token is not valid", 400)
  }

  async validateJWTToken(token: string) {
    const validateToken = await verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
    return validateToken as JWTResponse
  }
}
