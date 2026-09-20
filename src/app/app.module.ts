import { HelperModule } from '@/shared/helper/helper.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HelperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
