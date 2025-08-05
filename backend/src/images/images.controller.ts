// src/images/images.controller.ts

import { Controller, Post, Body, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { Response } from 'express';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async receiveImage(
    @Body()
    body: CreateImageDto,
    // @Res() res: Response,
  ) {
    // // Simulate upload by pushing this data through your pipeline
    // console.log('body', body);
    // if (!body.url || !body.sessionId || !body.targetFormat) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Missing url, sessionId, or targetFormat' });
    // }
     return await this.imagesService.enqueueJobs(body);
  }
}
