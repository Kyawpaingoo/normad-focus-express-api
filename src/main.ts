import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // CORS configuration
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  // Cookie parser middleware
  app.use(cookieParser());

  // Global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = process.env.HTTP_PORT || 3000;

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  console.log('Connected to the database successfully');
}

bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});
