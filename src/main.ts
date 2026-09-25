import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import contentParser from '@fastify/multipart';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(contentParser);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => console.log('Server running...'))
  .catch(() => process.exit(1));
