import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly config: ConfigService) {}

  get<T>(key: string): T | undefined {
    if (!key) throw new Error('key is required');
    const result = this.config.get<T>(key);
    if (!result) throw new Error(`${key} not configured in your env`);
    return result;
  }
}
