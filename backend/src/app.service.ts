import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hi Nothing here to  see, go to https://nestjs-image-convertor-app.vercel.app/';
  }
}
