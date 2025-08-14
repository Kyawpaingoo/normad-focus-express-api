import { Router } from 'express';
import multer from "multer";
import {imageUpload} from '../imageUpload/imageupload';
const imageUploadRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

imageUploadRouter.post("/upload", imageUpload);

export default imageUploadRouter;