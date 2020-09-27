const Course = require('../models/Course');
const REDIS_PORT = process.env.PORT || 6379;

exports.AllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).populate('videos').populate('quiz');
    if (!courses) {
      return res.status(400).json({ msg: 'No courses availible now ...' });
    }
    return res.status(200).json({ courses: courses });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.CreateCourse = async (req, res, next) => {
  try {
    req.body.Publisher = req.user._id;
    console.log(req.body);
    const course = await Course.create(req.body);
    return res.status(201).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.UpdateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.course_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!course) {
      return res.status(400).json({ msg: 'No such Course exists' });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ msg: Server_Error });
  }
};

exports.DeleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.course_id);
    if (!course) {
      return res.status(400).json({ msg: 'No such Course exists' });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.OneCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.course_id)
      .populate('videos')
      .populate('quiz');
    if (!course) {
      return res.status(400).json({ msg: 'No such Course exists' });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json(error);
  }
};
