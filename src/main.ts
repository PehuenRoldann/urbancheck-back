import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN');

  app.enableCors({
    origin: corsOrigin, // o '*' si estás en desarrollo
    credentials: true,
  });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
