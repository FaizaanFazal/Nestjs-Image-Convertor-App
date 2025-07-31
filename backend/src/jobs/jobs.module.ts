import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WriteProcessor } from './write.processor';
import { ConvertProcessor } from './convert.processor';
import { EventsModule } from 'src/events/events.module';

console.log('Redis config:', {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'write',
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
          tls: {},
        },
      },
      {
        name: 'convert',
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
          tls: {},
        },
      },
    ),
    EventsModule,
  ],
  providers: [WriteProcessor, ConvertProcessor],
  exports: [BullModule],
})
export class JobsModule {}
