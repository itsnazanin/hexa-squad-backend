import multer from "multer";
import path from "path";
import fs from "fs";

type UploadOptions = {
  folder: string;
  allowedMimeTypes: string[];
  maxSize: number;
};

const createUpload = ({
  folder,
  allowedMimeTypes,
  maxSize,
}: UploadOptions) => {
  const uploadPath = path.join(process.cwd(), "src/uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadPath);
    },

    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname);

      const uniqueName = `${folder}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

      cb(null, uniqueName);
    },
  });

  const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    cb
  ) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  });
};

export const uploadTeacherAvatar = createUpload({
  folder: "teachers",
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  maxSize: 2 * 1024 * 1024,
});


export const uploadCourseThumbnail = createUpload({
  folder: "courses",
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  maxSize: 5 * 1024 * 1024,
});


export const uploadLessonFile = createUpload({
  folder: "lessons",
  allowedMimeTypes: [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
  ],
  maxSize: 20 * 1024 * 1024,
});


export const uploadBlogCover = createUpload({
  folder: "blogs",
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  maxSize: 5 * 1024 * 1024,
});

export const uploadBlogImage = createUpload({
  folder: "blogs",
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  maxSize: 5 * 1024 * 1024,
});