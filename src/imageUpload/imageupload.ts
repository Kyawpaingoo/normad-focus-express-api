import { Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../cloudinaryConfig";
import streamifier from "streamifier";

export const imageUpload = async (req: Request, res: Response): Promise<void> => {
    try {
        const {base64} = req.body;
        if(!base64)
        {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const base64Data = base64.split(",")[1];

        const imageBuffer = Buffer.from(base64Data, "base64");

        const result: UploadApiResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "itclubweb",
                    resource_type: "auto",
                    public_id: `${Date.now().toString()}_screenshot`,
                    transformation: [
                        { quality: "auto", fetch_format: "auto" },
                    ],
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result as UploadApiResponse);
                    }
                }
            );
            streamifier.createReadStream(imageBuffer).pipe(uploadStream);
        })

        res.status(200).json({ url: result.secure_url });
    } catch(err: any)
    {
        res.status(500).json({ error: "Image upload failed" });
    }
}

