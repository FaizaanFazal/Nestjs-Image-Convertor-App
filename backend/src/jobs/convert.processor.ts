import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import axios from 'axios';
import sharp from 'sharp';
import { EventsGateway } from '../events/events.gateway';

@Processor('convert')
export class ConvertProcessor {
  constructor(private events: EventsGateway) {}

  @Process('convert')
  async handleConvert(job: Job) {
    const { sessionId, url, targetFormat } = job.data;

    // Download original from Cloudinary
    const resp = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(resp.data);

    // Convert with Sharp
    const outBuffer = targetFormat === 'svg'
      ? buffer
      : await sharp(buffer).toFormat(targetFormat).toBuffer();

    // Emit as data URL
    const mime = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    }[targetFormat];
    const dataUrl = `data:${mime};base64,${outBuffer.toString('base64')}`;

    this.events.emitConverted({ sessionId, url: dataUrl });
    return { url: dataUrl };
  }
}
