import { JwtBody } from '@/common/types/jwt.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { v7 } from 'uuid';
import { DebugLoggerService } from './debug-logger.service';
import { EnvironmentService } from './environment.service';
@Injectable()
export class JwtService {
  constructor(
    private readonly env: EnvironmentService,
    private readonly debug: DebugLoggerService,
  ) {}

  private getDefaultOptions() {
    // Default options with security best practices
    const defaultOptions: jwt.SignOptions = {
      algorithm: 'HS256', // Use HS256 or RS256
      expiresIn: '1h', // Short-lived tokens
      // issuer: this.configService.get('JWT_ISSUER', 'your-app'),
      // audience: this.configService.get('JWT_AUDIENCE', 'your-audience'),
      notBefore: 0, // Not valid before now
      jwtid: this.generateJti(), // Unique token ID
    };
    return defaultOptions;
  }

  generateJti() {
    return v7();
  }

  sign<T extends object>(payload: T, options?: jwt.SignOptions) {
    // Validate payload
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload: must be a non-null object');
    }

    // Get secret from environment with fallback
    const secret = this.env.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const signOptions: jwt.SignOptions = {
      ...this.getDefaultOptions(),
      ...options,
    };

    // Remove sensitive data from payload

    try {
      return jwt.sign(payload, secret, signOptions);
    } catch (error: any) {
      this.debug.log(error);
    }
  }
  verifyToken(token: string) {
    try {
      const jwtSecret = this.env.get<string>('JWT_SECRET');
      if (!jwtSecret)
        throw new Error('JWT_SECRET is not configured in environment');
      const verified = jwt.verify(token, jwtSecret, {
        algorithms: ['HS256'],
      });
      return verified;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Token expired.');
      }

      throw new UnauthorizedException('Token verification failed.');
    }
  }
  decode<T extends JwtBody>(token: string): T {
    const result = this.verifyToken(token) as T;
    return result;
  }
}
