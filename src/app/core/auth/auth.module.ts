import { DatabaseModule } from '@/database/database.module';
import { HelperModule } from '@/shared/helper/helper.module';
import { ServiceModule } from '@/shared/service/service.module';
import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DatabaseModule, ServiceModule, HelperModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
