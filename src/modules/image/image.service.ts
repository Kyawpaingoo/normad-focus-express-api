import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import streamifier from 'streamifier';

@Injectable()
export class ImageService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadImage(base64: string): Promise<string> {
    if (!base64) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const base64Data = base64.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const cloudinary = this.cloudinaryService.getCloudinary();

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'itclubweb',
            resource_type: 'auto',
            public_id: `${Date.now().toString()}_screenshot`,
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as UploadApiResponse);
            }
          },
        );
        streamifier.createReadStream(imageBuffer).pipe(uploadStream);
      });

      return result.secure_url;
    } catch (err: any) {
      throw new InternalServerErrorException('Image upload failed');
    }
  }
}
