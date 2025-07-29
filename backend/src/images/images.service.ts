import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
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
  ) { }

  async enqueueJobs(
    file: Express.Multer.File,
    targetFormat: string,
    sessionId: string,
  ): Promise<EnqueueResult> {
    const writeJob = await this.writeQueue.add('write', {
      sessionId,
      url: file.path,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      uniqueName: file.filename,
    });

    const convertJob = await this.convertQueue.add('convert', {
      sessionId,
      url: file.path,
      targetFormat,
    });

    if (writeJob.id === undefined || convertJob.id === undefined) {
      throw new Error('Failed to enqueue job(s): missing job id');
    }

    return {
      writeJobId: writeJob.id.toString(),
      convertJobId: convertJob.id.toString(),
      originalUrl: file.path,
    };
  }

}
