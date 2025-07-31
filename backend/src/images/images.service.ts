import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

export interface EnqueueResult {
  writeJobId: string;
  convertJobId: string;
  originalUrl: string;
}

@Injectable()
export class ImagesService {
  constructor(
    @InjectQueue('write') private writeQueue: Queue,
    @InjectQueue('convert') private convertQueue: Queue,
  ) {}

  // src/images/images.service.ts
  async enqueueJobs({
    url,
    originalName,
    format,
    size,
    sessionId,
    targetFormat,
  }: {
    url: string;
    originalName: string;
    format: string;
    size: number;
    sessionId: string;
    targetFormat: string;
  }) {
    // 1. Queue write job
    const writeJob = await this.writeQueue.add('write', {
      sessionId,
      url,
      originalName,
      format,
      size,
    });

    // 2. Queue convert job
    const convertJob = await this.convertQueue.add('convert', {
      sessionId,
      url,
      originalName,
      targetFormat,
    });

    if (writeJob.id === undefined || convertJob.id === undefined) {
      throw new Error('Job id missing');
    }

    return {
      writeJobId: writeJob.id.toString(),
      convertJobId: convertJob.id.toString(),
      originalUrl: url,
    };
  }
}
