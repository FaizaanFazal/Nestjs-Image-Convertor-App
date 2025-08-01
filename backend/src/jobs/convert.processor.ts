import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import axios from 'axios';
import { EventsGateway } from '../events/events.gateway';
import * as sharp from 'sharp';

interface ConvertJobData {
  sessionId: string;
  url: string;
  originalName: string;
  targetFormat: 'jpeg' | 'png' | 'webp' | 'svg';
}

@Processor('convert')
export class ConvertProcessor {
  constructor(private events: EventsGateway) {}

  @Process('convert')
  async handleConvert(job: Job<ConvertJobData>) {
    console.log('CONVERT JOB STARTED', job.data);
    const { sessionId, url, originalName, targetFormat } = job.data;

    try {
      const resp = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
      });
      console.log('got image from cloud', resp.status);
      const buffer = Buffer.from(resp.data);

      // Convert with Sharp (only if not svg)
      const outBuffer =
        targetFormat === 'svg'
          ? buffer
          : await sharp(buffer).toFormat(targetFormat).toBuffer();
      const estimateSize = outBuffer.length;

      const mime: Record<ConvertJobData['targetFormat'], string> = {
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        svg: 'image/svg+xml',
      };
      const mimeType = mime[targetFormat];

      const dataUrl = `data:${mimeType};base64,${outBuffer.toString('base64')}`;
      console.log('EMIT converted', {
        sessionId,
        url: dataUrl.slice(0, 50) + '...',
        originalName,
        type: targetFormat,
        size: estimateSize,
      });
      this.events.emitConverted({
        sessionId,
        url: dataUrl,
        originalName,
        type: targetFormat,
        size: estimateSize,
      });

      return { url: dataUrl };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('something went wrong, Error:', error.message, error);
      } else {
        console.log('something went wrong, Unknown error:', error);
      }
    }
  }
}

// @Processor('convert')
// export class ConvertProcessor {
//   constructor(private events: EventsGateway) { }

//   @Process('convert')
//   async handleConvert(job: Job<ConvertJobData>) {
//     console.log('CONVERT JOB STARTED', job.data);
//     const { sessionId, url, originalName, targetFormat } = job.data;

//     try {
//       const resp = await axios.get<ArrayBuffer>(url, {
//         responseType: 'arraybuffer',
//       });
//       console.log('got iamge from cloud', resp.status);
//       const buffer = Buffer.from(resp.data);

//       const outBuffer =
//         targetFormat === 'svg'
//           ? buffer
//           : await sharp(buffer).toFormat(targetFormat).toBuffer();
//       const estimateSize = outBuffer.length;

//       const mime: Record<ConvertJobData['targetFormat'], string> = {
//         jpeg: 'image/jpeg',
//         png: 'image/png',
//         webp: 'image/webp',
//         svg: 'image/svg+xml',
//       };

//       console.log('converted and sending');

//       const dataUrl = `data:${mime};base64,${outBuffer.toString('base64')}`;
//       console.log('EMIT converted', {
//         sessionId,
//         url: dataUrl.slice(0, 50) + '...',
//         originalName: originalName,
//         type: targetFormat,
//         size: estimateSize,
//       });
//       this.events.emitConverted({
//         sessionId,
//         url: dataUrl,
//         originalName: originalName,
//         type: targetFormat,
//         size: estimateSize,
//       });

//       return { url: dataUrl };
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.log('something went wrong, Error:', error.message, error);
//       } else {
//         console.log('something went wrong, Unknown error:', error);
//       }
//     }
//   }
// }
