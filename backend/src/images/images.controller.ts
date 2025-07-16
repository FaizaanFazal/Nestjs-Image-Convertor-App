import {
  Controller, Post, UseInterceptors, UploadedFiles, Body, Res
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ImagesService } from "./images.service";
import { Response } from "express";
import * as multer from "multer";

// Use Multer memory storage (for in-memory file buffers)
const memoryStorage = multer.memoryStorage();

@Controller('api') // This means all routes are prefixed with /api
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('convert')
  @UseInterceptors(AnyFilesInterceptor({
    storage: memoryStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async convertImages(
    @UploadedFiles() files: multer.File[],
    @Body('targetFormat') targetFormat: string,
    @Res() res: Response
  ) {
    // Log received file meta for learning:
    console.log('Received files:', files.map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })));
    console.log('Received target format:', targetFormat);

    // For now, just respond OK!
    return res.json({ ok: true, fileCount: files.length, targetFormat });
  }
}
