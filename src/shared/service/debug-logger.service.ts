import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Injectable()
export class DebugLoggerService {
  private readonly logger = new Logger('DebugLogger');
  constructor(private readonly env: EnvironmentService) {}
  log(error?: any) {
    const isDev = this.env.get<string>('NODE_ENV') === 'development';
    if (!isDev || !error) return;
    this.logger.error(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error?.message ? error.message : 'Internal server error',
      error,
    );
  }
}
