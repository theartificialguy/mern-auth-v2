import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "./src/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
});
