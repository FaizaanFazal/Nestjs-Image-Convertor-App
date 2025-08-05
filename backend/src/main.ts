import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  interface CorsOriginCallback {
    (err: Error | null, allow?: boolean): void;
  }

  interface CorsOptions {
    origin: (origin: string | undefined, callback: CorsOriginCallback) => void;
    credentials: boolean;
  }

  app.enableCors(<CorsOptions>{
    origin: (origin: string | undefined, callback: CorsOriginCallback): void => {
      if (
        !origin ||
        origin === 'http://localhost:5173' ||
        origin === 'https://nestjs-image-convertor-app.vercel.app' ||
        origin === 'https://nestjs-image-convertor-24weyb5jl-faizaanfazals-projects.vercel.app' ||
        origin === 'https://nestjs-image-convertor-app-git-main-faizaanfazals-projects.vercel.app' ||
        origin === 'https://nestjs-image-convertor-j4i91prl4-faizaanfazals-projects.vercel.app' ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
