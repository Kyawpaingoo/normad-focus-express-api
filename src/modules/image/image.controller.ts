import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';

@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  async uploadImage(@Body('base64') base64: string, @Res() res: Response) {
    try {
      const url = await this.imageService.uploadImage(base64);
      return res.status(HttpStatus.OK).json({ url });
    } catch (error: any) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message || 'Image upload failed',
      });
    }
  }
}
