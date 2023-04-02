import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import * as cls from 'cls-hooked';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const namespace = cls.createNamespace('nestjs-learning');
  Sequelize.useCLS(namespace);
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('nestjs-learning')
    .setDescription('API Documentation')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, swaggerDoc);

  await app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
}
bootstrap();
