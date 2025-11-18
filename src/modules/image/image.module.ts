import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, CloudinaryService],
  exports: [ImageService],
})
export class ImageModule {}
