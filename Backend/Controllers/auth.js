const User = require('../models/User');

exports.Register = async (req, res, next) => {
  try {
    console.log(req.file.filename);
    const url = req.protocol + '://' + req.get('host');
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    console.log(user);
    if (user === null) {
      console.log('1');
      user = new User({
        name,
        email,
        password,
        imageUrl: url + '/public/' + req.file.filename,
      });
      console.log('2');
      const salt = await bcrypt.genSalt(10);

      password = await bcrypt.hash(password, salt);

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

          return res.json({ token, user });
        }
      );
    }
    console.log('1');
    return res.status(400).json({
      msg: 'User already exists',
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.Tp = async (req, res, next) => {
  console.log(req.file.filename);
  return res.json();
};
