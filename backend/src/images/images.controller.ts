// src/images/images.controller.ts

import { Controller, Post, Body, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  async receiveImage(
    @Body()
    body: {
      url: string;
      originalName: string;
      format: string;
      size: number;
      sessionId: string;
      targetFormat: string;
    },
    @Res() res: Response,
  ) {
    // Simulate upload by pushing this data through your pipeline
    console.log('body', body);
    if (!body.url || !body.sessionId || !body.targetFormat) {
      return res
        .status(400)
        .json({ error: 'Missing url, sessionId, or targetFormat' });
    }
    const result = await this.imagesService.enqueueJobs(body);
    return res.json(result);
  }
}
