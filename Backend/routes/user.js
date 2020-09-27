const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

const multer = require('multer');
const { uuid } = require('uuidv4');
const validation = require('../middleware/validation');

//Register a User

const DIR = './public/';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, uuid() + '-' + fileName);
//   },
// });
// //multer middleware
// let upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == 'image/png' ||
//       file.mimetype == 'image/jpg' ||
//       file.mimetype == 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuid() + '-' + fileName)
  }
});
//multer middleware
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

router.post('/register', upload.single('imageUrl'), async (req, res) => {
  const url = req.protocol + '://' + req.get('host');

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: 'User already exists',
      });
    }
    console.log(req);
    user = new User({
      name,
      email,
      password,
      imageUrl: url + '/public/' + req.file.filename,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;

        res.json({ token, user });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

router.post('/user_register', async (req, res) => {
  const url = req.protocol + '://' + req.get('host');

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: 'User already exists',
      });
    }
    console.log(req);
    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;

        res.json({ token, user });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//Logging in the already registered user
router.post(
  '/login',
  [
    check('email', 'Please enter a valid email id').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email }).populate({
        path: 'enrolled_in',
        populate: {
          path: 'Course',
          populate: {
            path: 'videos quiz',
          },
        },
      });
      if (!user) {
        return res.status(400).json({
          msg: 'User not found',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: 'Incorrect password entered',
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;

          res.json({ token, user });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        msg: 'Server Error',
      });
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(res.locals.user._id).select('-password');
    console.log(user.name);

    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
