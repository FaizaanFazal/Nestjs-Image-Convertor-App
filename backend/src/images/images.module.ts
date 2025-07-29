import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { JobsModule } from '../jobs/jobs.module';  // <-- import the jobs module!

@Module({
  imports: [JobsModule],     
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
