import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
interface WriteJobData {
  sessionId: string;
  url: string;
  originalName: string;
  size: number;
  type: string;
  uniqueName: string;
  targetFormat: string;
  jobId: string;
}
@Processor('write')
export class WriteProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('write')
  async handleWrite(job: Job<WriteJobData>) {
    console.log('inserting', job.data);
    const { sessionId, url, originalName, size, type, uniqueName } = job.data;
    return this.prisma.image.create({
      data: {
        sessionId,
        cloudinaryUrl: url,
        originalName,
        uniqueName,
        type,
        size,
        targetFormat: job.data.targetFormat, // Make sure this exists in job.data
        jobId: job.data.jobId, // Make sure this exists in job.data
      },
    });
  }
}
