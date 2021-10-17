import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "documents") {
            cb(null, path.join(__dirname, '..', '..', 'public/uploads/'));
        }
      
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === "documents") { // if uploading resume
      if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) { // check file type to be pdf, doc, or docx
        cb(null, true);
      } else {
        cb(null, false); // else fails
      }
    }
}


  export const uploadFile = multer({
    storage: storage,
    limits: { fileSize: '1mb' },
    fileFilter: fileFilter 
  }).single("documents");
