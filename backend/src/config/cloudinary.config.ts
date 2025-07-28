import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop();
    const base = file.originalname.replace(/\.[^/.]+$/, '');
    const uniqueName = `${base}_${Date.now()}`;
    return {
      folder: 'image-convertor-app/originals',
      public_id: uniqueName,
      resource_type: 'image',
      format: ext,
      overwrite: false,
    };
  },
});

export const uploadOriginal = multer({ storage });
