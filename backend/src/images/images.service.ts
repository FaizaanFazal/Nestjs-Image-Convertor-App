import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as multer from 'multer';

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

  async enqueueJobs(
    file: Express.Multer.File,
    targetFormat: string,
    sessionId: string,
  ): Promise<EnqueueResult> {
    // 1) Queue write job (save original to DB)
    const writeJob = await this.writeQueue.add('write', {
      sessionId,
      url: file.path, // Cloudinary URL from multer-cloudinary
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      uniqueName: file.filename,
    });

    // 2) Queue conversion job (download & convert)
    const convertJob = await this.convertQueue.add('convert', {
      sessionId,
      url: file.path,
      targetFormat,
    });

    return {
      writeJobId: writeJob?.id.toString(),
      convertJobId: convertJob.id.toString(),
      originalUrl: file.path,
    };
  }
}
