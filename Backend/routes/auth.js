const { Register } = require('../Controllers/auth');

const { upload } = require('../middleware/multer');

const express = require('express');
const router = express.Router({ mergeParams: true });

//router.route('/tp').post(upload.single('file'), Tp);

module.exports = router;
