import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WriteProcessor } from './write.processor';
import { ConvertProcessor } from './convert.processor';


@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'write',   connection: { host: process.env.REDIS_HOST, port: +(process.env.REDIS_PORT ?? 6555) } },
      { name: 'convert', connection: { host: process.env.REDIS_HOST, port: +(process.env.REDIS_PORT ?? 6555) } },
    ),
  ],
  providers: [WriteProcessor, ConvertProcessor],
})
export class JobsModule {}
