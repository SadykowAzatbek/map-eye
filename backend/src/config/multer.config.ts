import { diskStorage } from 'multer';
import * as path from 'path';

export function createMulterStorage(uploadPath: string) {
  return diskStorage({
    destination: uploadPath,
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}
