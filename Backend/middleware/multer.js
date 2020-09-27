const multer = require('multer');
const DIR = './public/quiz_uploads';

const { uuid } = require('uuidv4');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuid() + '-' + fileName);
  },
});
//multer middleware
exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'text/csv' ||
      file.mimetype == 'application/vnd.ms-excel' ||
      file.mimetype ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});
