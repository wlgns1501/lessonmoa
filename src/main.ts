import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('LessonMoa')
    .setDescription('LessonMoa API description')
    .setVersion('3.0')
    .addBearerAuth(
      {
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        name: 'JWT',
        bearerFormat: 'JWT',
      },
      'authorization',
    )
    .build();

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
