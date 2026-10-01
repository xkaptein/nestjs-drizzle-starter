import { vineConfig } from '@/config/vine.config';
import { DatabaseModule } from '@/database/database.module';
import { HelperModule } from '@/shared/helper/helper.module';
import { ServiceModule } from '@/shared/service/service.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogsModule } from './core/audit-logs/audit-logs.module';
import { AuthModule } from './core/auth/auth.module';
import { PermissionsModule } from './core/permissions/permissions.module';
import { ResourcesModule } from './core/resources/resources.module';
import { RolesModule } from './core/roles/roles.module';
import { UsersModule } from './core/users/users.module';
import { UsersRepository } from './core/users/users.repository';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HelperModule,
    DatabaseModule,
    AuditLogsModule,
    PermissionsModule,
    UsersModule,
    RolesModule,
    ResourcesModule,
    AuthModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersRepository],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    vineConfig();
  }
}
