import { ServiceModule } from '@/shared/service/service.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgreProvider } from './provider/postgresql.provider';

@Module({
  imports: [ConfigModule, ServiceModule],
  providers: [PostgreProvider],
  exports: [PostgreProvider],
})
export class DatabaseModule {}
