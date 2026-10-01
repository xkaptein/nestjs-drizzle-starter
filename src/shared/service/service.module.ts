import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelperModule } from '../helper/helper.module';
import { DebugLoggerService } from './debug-logger.service';
import { EnvironmentService } from './environment.service';
import { JwtService } from './jwt.service';
import { ResponseDataService } from './response-data.service';

@Module({
  imports: [HelperModule],
  providers: [
    EnvironmentService,
    ConfigService,
    DebugLoggerService,
    ResponseDataService,
    JwtService,
  ],
  exports: [
    EnvironmentService,
    ConfigService,
    DebugLoggerService,
    ResponseDataService,
    JwtService,
  ],
})
export class ServiceModule {}
