const Course = require('../models/Course');
const MyCourse = require('../models/MyCourse');
const User = require('../models/User');
const path = require('path');
const FILE_UPLOAD_PATH = './public/quiz_uploads';
const multer = require('multer');
const { uuid } = require('uuidv4');
const DIR = './public/quiz_uploads';
const fs = require('fs');

const neatCsv = require('neat-csv');

exports.Enroll = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    req.body.Course = req.params.course_id;
    console.log(req.body);
    const c = await MyCourse.findOne({
      Course: req.params.course_id,
      user: req.user._id,
    });
    if (c) {
      return res
        .status(400)
        .json({ msg: 'You are already enrolled in this course' });
    }
    const course = await MyCourse.create(req.body);
    return res.status(200).json({ success: true, data: course });
  } catch (error) {}
};

exports.MyCourse = async (req, res, next) => {
  try {
    const mycourses = await MyCourse.find({ user: req.user._id }).populate({
      path: 'Course',
      populate: {
        path: 'videos quiz',
      },
    });
    if (!mycourses) {
      return res
        .status(400)
        .json({ msg: 'You have not enrolled in any course yet' });
    }
    return res.status(200).json({ success: true, data: mycourses });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/*

const MarksEntry = async ({ marks, outOf, quiz, user, course_id }) => {
  try {
    const u = await User.findOne({ email: user });
    const mycourse = await MyCourse.findOne({
      user: u._id,
      Course: course_id,
    });
    console.log(mycourse);
    let obj = {
      quiz: quiz,
      marks: marks,
      outOf: outOf,
    };
    let final_arr = [...mycourse.quiz_attempted, obj];
    mycourse.quiz_attempted = final_arr;
    await mycourse.save();
    return '1';
  } catch (error) {
    return '0';
  }
};
*/

//Multer

exports.Marks_Entry = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false });
    }
    console.log(req.file.filename);

    let data = fs.readFileSync(`./public/quiz_uploads/${req.file.filename}`);
    data = await neatCsv(data);

    console.log(data);

    data.map(async (d) => {
      const u = await User.findOne({ email: d.Email });
      const mycourse = await MyCourse.findOne({
        user: u._id,
        Course: req.params.course_id,
      });
      console.log(mycourse);

      let obj = {
        quiz: req.params.quiz_id,
        marks: d.Score.split('/')[0],
        outOf: d.Score.split('/')[1],
      };
      let final_arr = [...mycourse.quiz_attempted, obj];
      mycourse.quiz_attempted = final_arr;
      await mycourse.save();
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.OneCourse = async (req, res, next) => {
  try {
    const course = await MyCourse.findOne({
      user: req.user._id,
      Course: req.params.course_id,
    })
      .select('quiz_attempted')
      .populate({
        path: 'quiz_attempted.quiz',
        select: 'Title',
      });
    if (!course) {
      return res.status(400).json({ msg: 'No such course exists' });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.analytics = async (req, res, next) => {
  try {
    const course = await MyCourse.findOne({
      user: req.params.user_id,
      Course: req.params.course_id,
    }).populate({
      path: 'quiz_attempted.quiz',
      select: 'Title',
    });
    let arr = [];
    course.quiz_attempted.map(async (c) => {
      let obj = {
        marks: c.marks,
        title: c.quiz['Title'],
      };
      arr.push(obj);
    });
    console.log(arr);
    return res.status(200).json({ success: true, data: arr });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//For admin Dashboard,so admin can keep track of students progress in particular Course

exports.Student_Progress = async (req, res, next) => {
  try {
    const data = await MyCourse.find({ Course: req.params.course_id }).populate(
      {
        path: 'user',
      }
    );
    console.log(data);

    if (!data) {
      return res.status(400).json({ msg: 'No such course Found' });
    }
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json(error);
  }
};
