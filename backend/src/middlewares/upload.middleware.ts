import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => {
      cb(null, path.resolve(__dirname, '../../uploads'));
   },
   filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
   },
});

const fileFilter = (
   _req: any,
   file: Express.Multer.File,
   cb: multer.FileFilterCallback,
) => {
   const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
   ];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error('Only image files are allowed'));
   }
};

export const upload = multer({
   storage,
   fileFilter,
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
