import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS
  app.enableCors();

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Savings Vault API')
    .setDescription('사용자 저금고, 입금, 거래 관리를 위한 API')
    .setVersion('1.0')
    .addTag('api', '메인 API 엔드포인트')
    .addTag('users', '사용자 관리 API')
    .addTag('savings-vault', '저금고 관리 API')
    .addTag('deposits', '입금 관리 API')
    .addTag('trades', '거래 관리 API')
    .addTag('blockberry', 'Blockberry API 연동')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
