
import * as multer from "multer";
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadOriginal } from '../config/cloudinary.config';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { storage } from '../config/cloudinary.config';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  async receiveImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('targetFormat') targetFormat: string,
    @Body('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    if (!file || !sessionId || !targetFormat) {
      return res.status(400).json({ error: 'Missing file, sessionId, or targetFormat' });
    }

    // Pass all info to service
    const result = await this.imagesService.enqueueJobs(file, targetFormat, sessionId);
    return res.json(result); // { writeJobId, convertJobId, originalUrl }
  }
}
