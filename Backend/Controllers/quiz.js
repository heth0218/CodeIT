const quiz = require('../models/quiz');
const MyCourse = require('../models/MyCourse');
const SendEmail = require('../Utils/SendEmail');
const User = require('../models/User');
const Course = require('../models/Course');

exports.CreateQuiz = async (req, res, next) => {
  try {
    req.body.Publisher = req.user._id;
    req.body.Course = req.params.course_id;
    const Quiz = await quiz.create(req.body);

    const mycourses = await MyCourse.find({
      Course: req.params.course_id,
    });
    const courseName = await Course.findById(req.params.course_id).select(
      'Name'
    );
    mycourses.map(async (u) => {
      const user = await User.findById(u.user);
      const message = `A new Quiz has been added to ${courseName.Name}`;
      await SendEmail({
        email: user.email,
        subject: `A new Quiz has been added to ${courseName.Name}`,
        message: message,
      });
    });

    return res.status(201).json({ success: true, data: Quiz });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
