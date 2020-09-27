const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true, 'Please Add a Course Name'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please Add a Course Description'],
    },
    Published_Date: {
      type: Date,
      default: Date.now(),
      required: false,
    },
    Publisher: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true,
    },
    Thumbnail: {
      type: String,
    },
    Price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
CourseSchema.virtual('videos', {
  ref: 'video',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});

CourseSchema.virtual('quiz', {
  ref: 'quiz',
  localField: '_id',
  foreignField: 'Course',
  justOne: false,
});
module.exports = mongoose.model('Course', CourseSchema);
