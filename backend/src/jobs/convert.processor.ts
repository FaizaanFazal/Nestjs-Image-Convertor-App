import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull'; // <--- Should be 'bull', not 'bullmq' when using @nestjs/bull
import axios from 'axios';
import sharp from 'sharp';
import { EventsGateway } from '../events/events.gateway';

@Processor('convert')
export class ConvertProcessor {
  constructor(private events: EventsGateway) { }

  @Process('convert')
  async handleConvert(job: Job) {
    const { sessionId, url, targetFormat } = job.data;

    // Download original from Cloudinary
    try {
      const resp = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
      console.log("got iamge from cloud", resp)
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
      console.log("converted and sedning")

      const dataUrl = `data:${mime};base64,${outBuffer.toString('base64')}`;
      console.log('EMIT converted', { sessionId, url: dataUrl.slice(0, 50) + '...' });
      this.events.emitConverted({ sessionId, url: dataUrl });

      return { url: dataUrl };

    } catch (error) {
      console.log("something went wronmg, Error:", error.message, error)
    }



  }
}
