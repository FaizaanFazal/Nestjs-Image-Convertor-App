// src/images/images.controller.ts

import { Controller, Post, Body, Res, UsePipes, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async receiveImage(
    @Body()
    body: CreateImageDto,
  ) {
    return await this.imagesService.enqueueJobs(body);
  }
  
  // using gaurd only on get operation
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAllImages() {
    return await this.imagesService.getAllImages();
  }
}
