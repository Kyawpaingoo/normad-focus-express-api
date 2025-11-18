import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
export declare class ImageService {
    private cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(base64: string): Promise<string>;
}
