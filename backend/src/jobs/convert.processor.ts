import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull'; // <--- Should be 'bull', not 'bullmq' when using @nestjs/bull
import axios from 'axios';
import { EventsGateway } from '../events/events.gateway';
import * as sharp from 'sharp';

@Processor('convert')
export class ConvertProcessor {
  constructor(private events: EventsGateway) {}

  @Process('convert')
  async handleConvert(job: Job) {
    console.log('CONVERT JOB STARTED', job.data);
    const { sessionId, url, originalName, targetFormat } = job.data;

    // Download original from Cloudinary
    try {
      const resp = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
      });
      console.log('got iamge from cloud', resp.status);
      const buffer = Buffer.from(resp.data);

      // Convert with Sharp
      const outBuffer =
        targetFormat === 'svg'
          ? buffer
          : await sharp(buffer).toFormat(targetFormat).toBuffer();
      const estimateSize = outBuffer.length;

      // Emit as data URL
      const mime = {
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        svg: 'image/svg+xml',
      }[targetFormat];
      console.log('converted and sedning');

      const dataUrl = `data:${mime};base64,${outBuffer.toString('base64')}`;
      console.log('EMIT converted', {
        sessionId,
        url: dataUrl.slice(0, 50) + '...',
        originalName: originalName,
        type: targetFormat,
        size: estimateSize,
      });
      this.events.emitConverted({
        sessionId,
        url: dataUrl,
        originalName: originalName,
        type: targetFormat,
        size: estimateSize,
      });

      return { url: dataUrl };
    } catch (error) {
      console.log('something went wronmg, Error:', error.message, error);
    }
  }
}
