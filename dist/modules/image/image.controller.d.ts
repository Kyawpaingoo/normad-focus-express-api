import { Response } from 'express';
import { ImageService } from './image.service';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    uploadImage(base64: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
