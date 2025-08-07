import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/filters/middleware/logger.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ImagesModule,
    PrismaModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // * applying to all routes;can be specified also -> 'api/images' 
  }
}