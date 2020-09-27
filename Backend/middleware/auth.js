const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  //Get the token from the header

  const token = req.header('x-auth-token');

  //Check if not token

  if (!token) {
    return res.status(401).json({ msg: 'No token ,authorization denied' });
  }

  const decoded = jwt.verify(token, config.get('jwtSecret'));
  const user = await User.findById(decoded.user.id);
  req.user = user;
  res.locals.user = user;
  next();
};

exports.admin_access = async (req, res, next) => {
  //Get the token from the header

  const token = req.header('x-auth-token');

  //Check if not token

  if (!token) {
    return res.status(401).json({ msg: 'No token ,authorization denied' });
  }

  const decoded = jwt.verify(token, config.get('jwtSecret'));
  const user = await User.findById(decoded.user.id);
  if (user.role === 'learner') {
    return res.status(401).json({ msg: 'Denied Access' });
  }
  req.user = user;
  res.locals.user = user;
  next();
};

exports.GetUser = async (req, res, next) => {
  //Get the token from the header

  try {
    const token = req.header('x-auth-token');

    //Check if not token

    if (!token) {
      return res.status(401).json({ msg: 'No token ,authorization denied' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findById(decoded.user.id);
    req.user = user;
    res.locals.user = user;
    next();
  } catch (e) {
    return res.status(500).msg({ msg: server_error });
  }
};
