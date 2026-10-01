import contentParser from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { mb } from './shared/utils/file-size.utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(contentParser, {
    attachFieldsToBody: 'keyValues',
    limits: { fileSize: mb(5) },
  });

  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription(`${process.env.APP_NAME} - API Documentation`)
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    // .addServer(`http://${host}:${port}`, 'Local Development')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      showRequestDuration: true, // ✅ This shows response time in Swagger
      tagsSorter: 'alpha',
      filter: true,
      // displayOperationId: true,
      tryItOutEnabled: true,
      // docExpansion: 'none',
      // Additional options for better UI
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customCss: `
        .swagger-ui .response-col_status {
          min-width: 100px;
        }
        .swagger-ui .response-col_links {
          min-width: 150px;
        }
        .swagger-ui .info .title small.version-stamp {
          background-color: #89bf04;
        }
      `,
    customSiteTitle: 'Hospital Information System API',
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap()
  .then(() => console.log('Server running...'))
  .catch(() => process.exit(1));
