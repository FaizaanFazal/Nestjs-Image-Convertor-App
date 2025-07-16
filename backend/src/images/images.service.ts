import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  // ...Other methods...

  /**
   * Get all converted images and their meta by session ID
   */
  async getJobStatusBySession(sessionId: string) {
    // Assuming you stored sessionId with each image when creating jobs
    const images = await this.prisma.image.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });

    // Build response: Only images that have a converted URL (or whatever meta)
    const converted = images.filter(img => img.convertedUrl).map(img => ({
      originalName: img.originalName,
      format: img.targetFormat,
      url: img.convertedUrl, // This should be set by your BullMQ worker
    }));

    return {
      converted,
      done: images.length > 0 && images.every(img => img.convertedUrl), // or however you define "all done"
    };
  }
}
