const express = require('express');
const router = express.Router({ mergeParams: true });
const { admin_access, GetUser } = require('../middleware/auth');
const {
  Enroll,
  MyCourse,
  Marks_Entry,
  Student_Progress,
  OneCourse,
  analytics,
} = require('../Controllers/myCourse');

const { upload } = require('../middleware/multer');
router.route('/enroll/:course_id').post(GetUser, Enroll);
router.route('/').get(GetUser, MyCourse);
router.route('/one_course/:course_id').get(GetUser, OneCourse);
router.route('/analytics/:course_id/:user_id').get(GetUser, analytics);

//router.route('/marks_entry/:course_id').post(admin_access, MarksEntry);
router.route('/track_students/:course_id').get(admin_access, Student_Progress);
router
  .route('/marks_entry/:course_id/:quiz_id')
  .post(admin_access, upload.single('file'), Marks_Entry);

module.exports = router;
